export interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}
export interface DragTarget {
  dragOverHandler(eventL: DragEvent): void;
  dropHandler(eventL: DragEvent): void;
  dragLeaveHandler(eventL: DragEvent): void;
}
