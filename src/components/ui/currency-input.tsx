import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, normalizeDecimalInput } from '@/utils/formatters';

interface CurrencyInputProps {
  id?: string;
  value: string | number;
  onValueChange: (cleanValue: string) => void;
  placeholder?: string;
  currencySymbol?: string;
  className?: string;
  readOnly?: boolean;
  inputMode?: 'numeric' | 'decimal';
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  value,
  onValueChange,
  placeholder = "0.00",
  currencySymbol = "Q",
  className = "",
  readOnly = false,
  inputMode = "decimal"
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  // Update internal value when external value changes
  useEffect(() => {
    const stringValue = value?.toString() || '';
    if (!isFocused && stringValue) {
      setInternalValue(formatCurrency(stringValue));
    } else if (!isFocused) {
      setInternalValue('');
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Show clean value when focused
    const cleanValue = value?.toString() || '';
    setInternalValue(cleanValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format value when losing focus
    const cleanValue = normalizeDecimalInput(internalValue);
    if (cleanValue) {
      setInternalValue(formatCurrency(cleanValue));
    } else {
      setInternalValue('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    if (isFocused) {
      // While focused, allow typing and normalize input
      const normalized = normalizeDecimalInput(rawValue);
      setInternalValue(normalized);
      onValueChange(normalized);
    }
  };

  const displayValue = readOnly && value ? formatCurrency(value) : internalValue;

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        {currencySymbol}
      </span>
      <Input
        id={id}
        type="text"
        inputMode={inputMode}
        pattern="[0-9]*\.?[0-9]*"
        className={`pl-7 ${className}`}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        readOnly={readOnly}
      />
    </div>
  );
};

export default CurrencyInput;