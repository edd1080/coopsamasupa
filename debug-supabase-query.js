// Script para debuggear la consulta de Supabase
console.log('🔍 Debugging Supabase query for dates...');

// Simular lo que debería estar llegando desde Supabase
console.log('\n📋 Simulando consulta de applications:');
console.log('SELECT *, coopsama_external_reference_id, coopsama_operation_id, coopsama_process_id, coopsama_sync_status, coopsama_sync_error');
console.log('FROM applications');
console.log('WHERE agent_id = user.id');
console.log('ORDER BY created_at DESC');

console.log('\n📋 Simulando consulta de drafts:');
console.log('SELECT *');
console.log('FROM application_drafts');
console.log('WHERE agent_id = user.id');
console.log('ORDER BY updated_at DESC');

console.log('\n🔍 Posibles problemas:');
console.log('1. Los campos created_at/updated_at existen en la DB pero no se están insertando correctamente');
console.log('2. Hay un problema con la consulta SELECT que no está trayendo estos campos');
console.log('3. Los datos se están insertando sin estos campos (problema en la inserción)');
console.log('4. Hay un problema con el ordenamiento que está causando que los campos se pierdan');

console.log('\n💡 Soluciones a investigar:');
console.log('1. Verificar si los campos se están insertando correctamente en la DB');
console.log('2. Verificar si la consulta SELECT está trayendo todos los campos');
console.log('3. Verificar si hay algún problema con el ordenamiento');
console.log('4. Verificar si hay algún problema con el mapeo de datos');

console.log('\n🧪 Para debuggear:');
console.log('1. Agregar console.log para ver qué está llegando desde Supabase');
console.log('2. Verificar si created_at y updated_at están en los datos raw');
console.log('3. Verificar si el problema está en el mapeo o en la consulta');
