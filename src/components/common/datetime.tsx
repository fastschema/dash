import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { DayPickerSingleProps } from 'react-day-picker';

export interface DateTimePickerProps {
  calendarProps: DayPickerSingleProps;
  onChange?: (value: string) => void;
  selected?: Date;
}

export const DateTimePicker = (props: DateTimePickerProps) => {
  const { calendarProps, selected, onChange } = props;
  const selectedDateTime = selected ? dayjs(selected) : dayjs();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selectedDateTime.toDate());
  const [selectedTime, setSelectedTime] = useState<string>(selectedDateTime.format('HH:mm:ss'));

  useEffect(() => {
    if (!selectedDate) return;

    const [hours, minutes, seconds] = selectedTime.split(':').map((v) => parseInt(v));
    const newDate = dayjs(selectedDate).set('hour', hours).set('minute', minutes).set('second', seconds).format('YYYY-MM-DD HH:mm:ss');

    onChange?.(newDate);
  }, [selectedDate, selectedTime]);

  return <>
    <Calendar
      {...calendarProps}
      selected={selectedDate}
      style={{ width: '100%' }}
      initialFocus
      onSelect={(day?: Date) => {
        day && setSelectedDate(day);
      }}
    />
    <div className='p-3'>
      <Input type='time' value={selectedTime} onChange={(e) => {
        setSelectedTime(e.target.value);
      }} />
    </div>
  </>;
}
