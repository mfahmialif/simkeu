<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:modelValue"])

const canvasRef = ref(null)
const drawing = ref(false)
let context = null
let resizeObserver = null
let resizeFrame = null

const applyPenStyle = () => {
  if (!context) return

  context.lineCap = "round"
  context.lineJoin = "round"
  context.lineWidth = 2.8
  context.strokeStyle = "#171717"
}

const fillCanvasBackground = () => {
  const canvas = canvasRef.value

  if (!canvas || !context) return

  const rect = canvas.getBoundingClientRect()

  context.save()
  context.fillStyle = "#fff"
  context.fillRect(0, 0, rect.width, rect.height)
  context.restore()
}

const drawPreviousImage = imageDataUrl => {
  if (!imageDataUrl) return

  const canvas = canvasRef.value
  const image = new Image()

  image.onload = () => {
    if (!canvas || !context || drawing.value) return

    const rect = canvas.getBoundingClientRect()

    context.drawImage(image, 0, 0, rect.width, rect.height)
    applyPenStyle()
  }

  image.src = imageDataUrl
}

const prepareCanvas = () => {
  const canvas = canvasRef.value

  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const ratio = window.devicePixelRatio || 1
  const width = Math.floor(rect.width * ratio)
  const height = Math.floor(rect.height * ratio)

  if (width < 2 || height < 2) return
  if (context && canvas.width === width && canvas.height === height) return

  const previousImage = props.modelValue || (canvas.width > 1 && canvas.height > 1
    ? canvas.toDataURL("image/png")
    : "")

  canvas.width = width
  canvas.height = height
  context = canvas.getContext("2d")
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  applyPenStyle()
  fillCanvasBackground()
  drawPreviousImage(previousImage)
}

const schedulePrepareCanvas = () => {
  if (resizeFrame) cancelAnimationFrame(resizeFrame)

  resizeFrame = requestAnimationFrame(() => {
    prepareCanvas()
    resizeFrame = null
  })
}

const pointFromEvent = event => {
  const rect = canvasRef.value.getBoundingClientRect()

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

const startDrawing = event => {
  prepareCanvas()
  if (props.disabled || !context) return

  event.preventDefault()
  drawing.value = true

  const point = pointFromEvent(event)

  context.beginPath()
  context.moveTo(point.x, point.y)
  canvasRef.value.setPointerCapture?.(event.pointerId)
}

const draw = event => {
  if (!drawing.value || props.disabled || !context) return

  event.preventDefault()

  const point = pointFromEvent(event)

  context.lineTo(point.x, point.y)
  context.stroke()
}

const stopDrawing = event => {
  if (!drawing.value) return

  drawing.value = false
  canvasRef.value.releasePointerCapture?.(event.pointerId)

  emit("update:modelValue", canvasRef.value.toDataURL("image/png"))
}

const clear = () => {
  if (!context || props.disabled) return

  fillCanvasBackground()
  emit("update:modelValue", "")
}

onMounted(() => {
  nextTick(schedulePrepareCanvas)
  window.addEventListener("resize", schedulePrepareCanvas)

  if (window.ResizeObserver && canvasRef.value) {
    resizeObserver = new ResizeObserver(schedulePrepareCanvas)
    resizeObserver.observe(canvasRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", schedulePrepareCanvas)
  resizeObserver?.disconnect()

  if (resizeFrame) cancelAnimationFrame(resizeFrame)
})

defineExpose({ clear })
</script>

<template>
  <div class="signature-pad">
    <canvas
      ref="canvasRef"
      aria-label="Area tanda tangan"
      class="signature-pad__canvas"
      :class="{ 'signature-pad__canvas--disabled': disabled }"
      @pointerdown="startDrawing"
      @pointermove="draw"
      @pointerup="stopDrawing"
      @pointercancel="stopDrawing"
      @pointerleave="stopDrawing"
    />

    <div class="signature-pad__footer">
      <VBtn
        size="small"
        variant="text"
        color="secondary"
        prepend-icon="ri-eraser-line"
        :disabled
        @click="clear"
      >
        Bersihkan
      </VBtn>
    </div>
  </div>
</template>

<style scoped>
.signature-pad {
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background: rgb(var(--v-theme-surface));
}

.signature-pad__canvas {
  display: block;
  width: 100%;
  height: 220px;
  background:
    linear-gradient(to bottom, transparent calc(100% - 42px), rgba(var(--v-border-color), 0.28) calc(100% - 41px), transparent calc(100% - 40px)),
    #fff;
  cursor: crosshair;
  touch-action: none;
}

.signature-pad__canvas--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.signature-pad__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 12px;
  border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
