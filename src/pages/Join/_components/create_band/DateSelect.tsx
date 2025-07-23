import React, { useState, useMemo, type ChangeEvent } from "react";
import SelectWithArrow from "./SelectWithArrow";

interface DateSelectProps {
  /** 최소 연도 (기본: 현재 연도) */
  minYear?: number;
  /** 최대 연도 (기본: 30년 후) */
  maxYear?: number;
  onChange?: (date: Date) => void;
}

const DateSelect: React.FC<DateSelectProps> = ({
  minYear = new Date().getFullYear(),
  maxYear = minYear + 30,
  onChange,
}) => {
  const [year, setYear] = useState<number>(minYear);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [day, setDay] = useState<number>(new Date().getDate());

  // 연도 리스트
  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i),
    [minYear, maxYear]
  );

  // 월 리스트 (1~12)
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  // 선택된 year/month 기준으로 해당 월의 일 수 계산
  const daysInMonth = useMemo(
    () => new Date(year, month, 0).getDate(),
    [year, month]
  );

  // 일 리스트 (1~daysInMonth)
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  // 연·월·일 중 하나라도 바뀌면 부모에 날짜 전달
  const triggerChange = (y: number, m: number, d: number) => {
    if (onChange) onChange(new Date(y, m - 1, d));
  };

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const y = +e.target.value;
    setYear(y);
    // day가 새로운 월의 일 수를 초과하면 clamp
    const d = Math.min(day, new Date(y, month, 0).getDate());
    setDay(d);
    triggerChange(y, month, d);
  };

  const handleMonthChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const m = +e.target.value;
    setMonth(m);
    const d = Math.min(day, new Date(year, m, 0).getDate());
    setDay(d);
    triggerChange(year, m, d);
  };

  const handleDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const d = +e.target.value;
    setDay(d);
    triggerChange(year, month, d);
  };

  return (
    <div className="flex gap-[8px]">
      <SelectWithArrow
        value={year.toString()}
        onChange={handleYearChange}
        options={years.map((y) => y.toString())}
        postfix="년"
      />
      <SelectWithArrow
        value={month.toString()}
        onChange={handleMonthChange}
        options={months.map((m) => m.toString())}
        postfix="월"
      />
      <SelectWithArrow
        value={day.toString()}
        onChange={handleDayChange}
        options={days.map((d) => d.toString())}
        postfix="일"
      />
    </div>
  );
};

export default DateSelect;
