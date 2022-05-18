import { NextPage } from "next";
import { ChangeEvent, useState } from "react";

const Checkbox: NextPage<{id: string, name: string; checkedHandler: (id: string, checked: boolean) => void}> = ({id, name, checkedHandler}) => {
  const [checked, setChecked] = useState(false);
  
  const checkHandler = (id: string) => (ev: ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked);
    checkedHandler(id, ev.target.checked);
  };
  
  return <input type="checkbox" id={id} name={name} checked={checked} onChange={checkHandler(id)} />
}

export default Checkbox;