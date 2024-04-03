import { getDefaultFieldRenders } from './content/renders';

export const createWindowObject = () => {
  if (window === undefined || window.fastschema) {
    return;
  }

  window.fastschema = {
    ui: {
      fieldRenders: getDefaultFieldRenders(),
    }
  }
}
