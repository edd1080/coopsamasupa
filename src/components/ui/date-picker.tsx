
import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  date, 
  onSelect, 
  placeholder = "Seleccionar fecha",
  className,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Ensure we always have a valid Date object
  const getValidDate = (dateValue: Date | string | undefined) => {
    if (!dateValue) return new Date();
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  };

  const [currentMonth, setCurrentMonth] = React.useState(() => getValidDate(date));

  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);

  const handleDateSelect = (selectedDate: Date) => {
    onSelect?.(selectedDate);
    setIsOpen(false); // Cerrar automáticamente al seleccionar
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentYear, parseInt(monthIndex), 1);
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), currentMonthIndex, 1);
    setCurrentMonth(newDate);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonthIndex);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonthIndex);
    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentYear, currentMonthIndex, day);
      const validDate = getValidDate(date);
      const isSelected = date && 
        validDate.getDate() === day && 
        validDate.getMonth() === currentMonthIndex && 
        validDate.getFullYear() === currentYear;

      days.push(
        <Button
          key={day}
          variant={isSelected ? "default" : "ghost"}
          className={cn(
            "h-9 w-9 p-0 font-normal",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          )}
          onClick={() => handleDateSelect(dayDate)}
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  // Convert date to valid Date object for display
  const displayDate = date ? getValidDate(date) : undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayDate ? format(displayDate, "PPP", { locale: es }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Header con navegación de mes y año */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Select value={currentMonthIndex.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
              <div key={day} className="h-9 w-9 flex items-center justify-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Grid de días */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
