import { ReactComponent as SpinnerIcon } from '../assets/icons/spinner.svg';

export function Spinner() {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <SpinnerIcon className="animate-spin m-3 h-16 w-16 text-yellow-400" />
    </div>
  );
}
