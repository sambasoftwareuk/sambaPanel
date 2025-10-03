import { getSideMenuForPath } from "@/lib/repos/sideMenu";

export async function getSideMenuData(path,locale) {
    const sideMenu = await getSideMenuForPath(path, locale);

    function toArray(x) {
    return x == null ? [] : Array.isArray(x) ? x : [x];
  }
    
    const arraySideMenu = toArray(sideMenu);
    
    return arraySideMenu;

}