declare function Nid(spec?: number | object): any;
declare namespace Nid {
    var curses: () => any;
    var len: number | undefined;
    var alphabet: string | undefined;
}
declare type Nid = typeof Nid;
export type { Nid };
export default Nid;
