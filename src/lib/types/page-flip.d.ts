declare module 'page-flip' {
  export interface PageFlipOptions {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    startPage?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startVelocity?: number;
    currPage?: number;
  }

  export interface PageFlipEvent {
    data: number | string;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions);
    loadFromImages(images: string[]): void;
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void;
    updateFromImages(images: string[]): void;
    updateFromHtml(items: NodeListOf<Element> | HTMLElement[]): void;
    turnToPage(page: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    flip(page: number, corner?: 'top' | 'bottom'): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    destroy(): void;
    on(event: 'flip' | 'changeOrientation' | 'changeState' | 'init', callback: (e: PageFlipEvent) => void): void;
    off(event: string, callback: (e: any) => void): void;
    getOrientation(): 'portrait' | 'landscape';
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getState(): 'read' | 'flipper' | 'user_fold' | 'fold_corner';
    update(): void;
  }

  const _default: {
    PageFlip: typeof PageFlip;
  };
  export default _default;
}
