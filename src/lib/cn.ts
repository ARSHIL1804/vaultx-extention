import cx from "classnames"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: cx.ArgumentArray) {
  return twMerge(cx(inputs))
}

export function convert(price:number){
  return price / Math.pow(10,18);
}
