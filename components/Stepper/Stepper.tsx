import { Button } from '../Button';
import styles from './Stepper.module.css';

export interface StepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

export const Stepper = ({ value, onChange, min, max }: StepperProps) => {
  const canIncrease = max === undefined || value < max;
  const canDecrease = min === undefined || value > min;

  const increase = () => {
    onChange(value + 1);
  };

  const decrease = () => {
    onChange(value - 1);
  };

  return (
    <div className={styles.stepper}>
      <Button disabled={!canDecrease} onClick={decrease}>
        ◀
      </Button>

      <span className={styles.value}>{value}</span>

      <Button disabled={!canIncrease} onClick={increase}>
        ▶
      </Button>
    </div>
  );
};
