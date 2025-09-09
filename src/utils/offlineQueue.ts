import localforage from 'localforage';

export interface OfflineTask {
  id: string;
  type: 'createApplication' | 'createPrequalification' | 'uploadDocument' | 'updateDraft' | 'deleteDraft';
  payload: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'offline-queue';
const MAX_RETRIES = 3;

// Initialize localforage for offline queue
const queueStore = localforage.createInstance({
  name: 'coopsama',
  storeName: 'offlineQueue'
});

export const offlineQueue = {
  async enqueue(task: Omit<OfflineTask, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    const queue = await this.getQueue();
    const newTask: OfflineTask = {
      ...task,
      id: `${task.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0
    };
    
    queue.push(newTask);
    await queueStore.setItem(QUEUE_KEY, queue);
    
    console.log('🔄 Task enqueued for offline processing:', newTask.type);
  },

  async getQueue(): Promise<OfflineTask[]> {
    const queue = await queueStore.getItem<OfflineTask[]>(QUEUE_KEY);
    return queue || [];
  },

  async removeTask(taskId: string): Promise<void> {
    const queue = await this.getQueue();
    const filteredQueue = queue.filter(task => task.id !== taskId);
    await queueStore.setItem(QUEUE_KEY, filteredQueue);
  },

  async incrementRetries(taskId: string): Promise<boolean> {
    const queue = await this.getQueue();
    const taskIndex = queue.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return false;
    
    queue[taskIndex].retries += 1;
    
    if (queue[taskIndex].retries >= MAX_RETRIES) {
      // Remove task if max retries exceeded
      queue.splice(taskIndex, 1);
      console.warn('❌ Task removed after max retries:', taskId);
    }
    
    await queueStore.setItem(QUEUE_KEY, queue);
    return queue[taskIndex]?.retries < MAX_RETRIES;
  },

  async clearQueue(): Promise<void> {
    await queueStore.removeItem(QUEUE_KEY);
  },

  async getQueueSize(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }
};