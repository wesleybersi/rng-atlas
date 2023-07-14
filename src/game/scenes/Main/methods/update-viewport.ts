import MainScene from "../MainScene";

export default function updateViewport(this: MainScene) {
  const camera = this.cameras.main;

  const viewportX = camera.worldView.x / camera.zoom;
  const viewportY = camera.worldView.y / camera.zoom;

  const viewportWidth = camera.width / camera.zoom;
  const viewportHeight = camera.height / camera.zoom;

  const cellHeight = this.cellHeight / camera.zoom;
  const cellWidth = this.cellWidth / camera.zoom;

  const extendedArea = 1; // Number of additional rows and columns to consider outside the viewport

  this.viewport.startRow = Math.floor(
    (viewportY - extendedArea * cellHeight) / cellHeight
  );
  this.viewport.startCol = Math.floor(
    (viewportX - extendedArea * cellWidth) / cellWidth
  );

  this.viewport.visibleRows = Math.ceil(
    (viewportHeight + extendedArea * this.cellHeight) / this.cellHeight
  );
  this.viewport.visibleCols = Math.ceil(
    (viewportWidth + extendedArea * this.cellWidth) / this.cellWidth
  );
}
