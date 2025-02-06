import { getStroke } from "perfect-freehand";

// Define the type for a line session which is an array of 2D points.
type LineSession = Array<number[]>;

export class CanvasService {
  // Reference to the canvas element and its 2D rendering context
  private drawCanvas: HTMLCanvasElement;
  private drawCanvasContext: CanvasRenderingContext2D;

  private imageCanvas: HTMLCanvasElement;
  private imageCanvasContext: CanvasRenderingContext2D;

  private originalImageCanvas: HTMLCanvasElement;
  private originalImageContext: CanvasRenderingContext2D;

  private originalImageCanvasTemp: HTMLCanvasElement;
  private originalImageContextTemp: CanvasRenderingContext2D;

  // Reactive properties to track if the canvas was clicked and the currently selected tool
  public canvasClicked: boolean = false;
  public selectedTool: string = "draw"; // Default tool is "draw"
  public currentLineSession: LineSession; // Current line session (array of points)
  public lines: LineSession[] = []; // Array to store all drawn lines
  public baseImage: string = "";


  /**
   * Constructor for the CanvasService class.
   * @param canvas - A reactive reference to the canvas HTML element.
   */
  constructor(drawCanvas: HTMLCanvasElement, imageCanvas: HTMLCanvasElement) {
    this.drawCanvas = drawCanvas;
    this.drawCanvasContext = drawCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    this.imageCanvas = imageCanvas;
    this.imageCanvasContext = imageCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    this.originalImageCanvas = document.createElement("canvas");
    this.originalImageContext = this.originalImageCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    this.originalImageCanvasTemp = document.createElement("canvas");
    this.originalImageContextTemp = this.originalImageCanvasTemp.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    this.currentLineSession = []; // Initialize with an empty line session
  }

  // Store the original background image
  public saveOriginalBackground() {
    const width = this.imageCanvas.width;
    const height = this.imageCanvas.height;

    this.originalImageCanvas.width = width;
    this.originalImageCanvas.height = height;

    // Draw the image canvas into the off-screen canvas
    this.originalImageContext.clearRect(0, 0, width, height);
    this.originalImageContext.drawImage(this.imageCanvas, 0, 0);

    this.originalImageContext.save();

    this.originalImageCanvasTemp.width = width;
    this.originalImageCanvasTemp.height = height;
    this.originalImageContextTemp.clearRect(0, 0, width, height);
    this.originalImageContextTemp.drawImage(this.imageCanvas, 0, 0)
  }

  /**
   * Gets the canvas reference.
   * @returns - The reactive reference to the canvas element.
   */
  public getDrawCanvas(): HTMLCanvasElement {
    return this.drawCanvas;
  }

  /**
   * Gets the 2D rendering context for the canvas.
   * @returns - The reactive reference to the 2D context.
   */
  public getDrawCanvasContext(): CanvasRenderingContext2D {
    return this.drawCanvasContext;
  }

  /**
   * Handles the mouseup event on the canvas.
   * Finalizes the current line session and adds it to the lines array.
   */
  public onCanvasMouseUp() {
    this.canvasClicked = false; // Reset canvas clicked state

    if (this.currentLineSession.length) {
      this.lines.push(this.currentLineSession); // Save the current line session
      this.currentLineSession = []; // Reset current line session for next drawing
    }
  }

  /**
   * Handles the mousedown event on the canvas.
   * Initializes the drawing state when the user starts drawing.
   */
  public onCanvasMouseDown() {
    switch (this.selectedTool) {
      case "draw":
        this.canvasClicked = true; // Set canvas clicked state to true
        this.drawCanvasContext.globalCompositeOperation = "source-over";
        break;

      case "eraser":
        this.canvasClicked = true; // Set canvas clicked state to true
        this.drawCanvasContext.globalCompositeOperation = "destination-out";
        break;

      case "draw-mask":
        this.canvasClicked = true;
        this.imageCanvasContext.globalCompositeOperation = "destination-out";
        break;

      default:
        break;
    }
  }

  /**
   * Handles the mousemove event on the canvas.
   * Draws lines if the mouse is being held down and the drawing tool is selected.
   *
   * @param $event - The MouseEvent object.
   * @param canvasPositionX - The X position of the canvas relative to the viewport.
   * @param canvasPositionY - The Y position of the canvas relative to the viewport.
   * @param viewportX - The X position of the viewport.
   * @param viewportY - The Y position of the viewport.
   * @param brushSize - Size of the brush.
   * @param brushColor - Color of the brush (Hex).
   */
  public onCanvasMouseMove(
    $event: MouseEvent,
    canvasPositionX: number,
    canvasPositionY: number,
    viewportX: number,
    viewportY: number,
    brushSize: number,
    brushColor: string
  ) {
    if (this.canvasClicked) {
      const calculatedX = $event.clientX - canvasPositionX - viewportX;
      const calculatedY = $event.clientY - canvasPositionY - viewportY;

      if (calculatedX && calculatedY)
        this.currentLineSession.push([calculatedX, calculatedY]);

      // If drawing tool is selected, call drawLines to handle the mouse movement
      switch (this.selectedTool) {
        case "draw":
          this.drawLines(
            calculatedX,
            calculatedY,
            brushSize,
            brushColor,
            this.drawCanvasContext
          );
          break;

        case "eraser":
          this.drawLines(
            calculatedX,
            calculatedY,
            brushSize,
            brushColor,
            this.drawCanvasContext
          );

          // this.drawLines(
          //   calculatedX,
          //   calculatedY,
          //   brushSize,
          //   brushColor,
          //   this.imageCanvasContext
          // );
          break;

        case "draw-mask":
          this.drawMask(calculatedX, calculatedY, brushSize);

        // this.drawLines(
        //   calculatedX,
        //   calculatedY,
        //   brushSize,
        //   brushColor
        // );
        default:
          break;
      }
    }
  }

  /**
   * Draws a line on the canvas based on the mouse position.
   *
   * @param x - The current mouse X position on the viewport.
   * @param y - The current mouse Y position on the viewport.
   * @param canvasPositionX - The X position of the canvas relative to the viewport.
   * @param canvasPositionY - The Y position of the canvas relative to the viewport.
   * @param viewportX - The X position of the viewport.
   * @param viewportY - The Y position of the viewport.
   * @param brushSize - Size of the brush.
   * @param brushColor - Color of the brush (Hex).
   */
  public drawLines(
    calculatedX: number,
    calculatedY: number,
    brushSize: number,
    brushColor: string,
    context: CanvasRenderingContext2D
  ) {
    if (context) {
      // Add the calculated position to the current line session
      if (calculatedX && calculatedY) {
        // Generate path data for drawing the stroke
        const pathData = this.getPathData(brushSize);
        const path = new Path2D(pathData);

        // Set the brush color (make sure the brushOptionsStore exists and has the right structure)
        context.fillStyle = brushColor;
        context.fill(path);

        if(this.originalImageContext && this.selectedTool === "eraser") {
          this.originalImageContext.clearRect(0, 0, this.originalImageCanvas.width, this.originalImageCanvas.height);
          this.originalImageContext.beginPath();

          this.originalImageContext.globalCompositeOperation = "source-over";
          this.originalImageContext.drawImage(this.originalImageCanvasTemp, 0, 0);

          this.originalImageContext.globalCompositeOperation = "destination-in";

          this.originalImageContext.fillStyle = "#00dc82"
          this.originalImageContext.fill(path);

          this.imageCanvasContext.globalCompositeOperation = "source-over";
          this.imageCanvasContext.drawImage(this.originalImageCanvas, 0, 0);
        }
      }
    }
  }


  /**
   * Draws a line on the canvas based on the mouse position.
   *
   * @param calculatedX - The X position of the mouse calculated by viewport and canvas position etc.
   * @param calculatedY - The Y position of the mouse calculated by viewport and canvas position etc.
   * @param brushSize - Size of the brush.
   */
  public drawMask(calculatedX: number, calculatedY: number, brushSize: number) {
    if (this.imageCanvasContext) {
      // Add the calculated position to the current line session
      if (calculatedX && calculatedY) {
        // Generate path data for drawing the stroke
        const pathData = this.getPathData(brushSize);
        const path = new Path2D(pathData);

        // Fill the path to render the stroke on the canvas
        this.imageCanvasContext.fill(path);
      }
    }
  }

  /**
   * Generates SVG path data from the current line session for the brush size.
   * Uses `getStroke` to calculate smooth stroke data based on user input.
   *
   * @param brushSize - The size of the brush used to draw the line.
   * @returns - The SVG path data as a string.
   */
  public getPathData(brushSize: number) {
    // Use `getStroke` to calculate the path data from the current line session
    const stroke = getStroke(this.currentLineSession, {
      size: brushSize,
      thinning: 0.5, // Reduces the width of the stroke over time
      simulatePressure: false, // Disable pressure simulation
      smoothing: 1, // Controls smoothing of the stroke
      streamline: 0, // Controls how streamlined the path is
    });

    // Convert the stroke to an SVG path string and return
    const pathData = this.getSvgPathFromStroke(stroke);
    return pathData;
  }

  /**
   * Converts a series of points (line session) into an SVG path string.
   *
   * @param points - The points of the line session.
   * @param closed - Whether to close the path (optional, default is true).
   * @returns - The SVG path string representing the stroke.
   */
  public getSvgPathFromStroke(points: LineSession, closed = true) {
    // Helper function to average two numbers
    const average = (a: number, b: number) => (a + b) / 2;

    const len = points.length;

    // If there are not enough points to form a valid path, return an empty string
    if (len < 4) {
      return ``;
    }

    let a = points[0];
    let b = points[1];
    const c = points[2];

    // Initialize the SVG path string with the first two points and the control point for the quadratic curve
    let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
      2
    )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
      b[1],
      c[1]
    ).toFixed(2)} T`;

    // Loop through the rest of the points and add them to the path string
    for (let i = 2, max = len - 1; i < max; i++) {
      a = points[i];
      b = points[i + 1];
      result += `${average(a[0], b[0]).toFixed(2)},${average(
        a[1],
        b[1]
      ).toFixed(2)} `;
    }

    // Close the path if specified
    if (closed) {
      result += "Z";
    }

    return result;
  }
}
