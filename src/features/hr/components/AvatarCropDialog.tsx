import { useCallback, useRef, useState } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface AvatarCropDialogProps {
  open: boolean
  imageSrc: string
  onClose: () => void
  onConfirm: (blob: Blob) => void
  isPending?: boolean
}

function centerCircleCrop(width: number, height: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
    width,
    height,
  )
}

async function getCroppedBlob(
  img: HTMLImageElement,
  crop: PixelCrop,
  scale: number,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const size = 256
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const scaleX = (img.naturalWidth / img.width) / scale
  const scaleY = (img.naturalHeight / img.height) / scale

  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.clip()

  ctx.drawImage(
    img,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    size,
    size,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(b => b ? resolve(b) : reject(new Error('Canvas is empty')), 'image/jpeg', 0.92)
  })
}

export function AvatarCropDialog({ open, imageSrc, onClose, onConfirm, isPending }: AvatarCropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerCircleCrop(width, height))
  }, [])

  const handleConfirm = async () => {
    if (!imgRef.current || !completedCrop) return
    const blob = await getCroppedBlob(imgRef.current, completedCrop, scale)
    onConfirm(blob)
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh ảnh đại diện</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="overflow-hidden rounded-lg max-h-[360px] w-full flex items-center justify-center bg-muted">
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              aspect={1}
              circularCrop
              minWidth={60}
              minHeight={60}
              keepSelection
            >
              {/* ponytail: scale via transform instead of CSS zoom for browser compat */}
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                style={{ transform: `scale(${scale})`, transformOrigin: 'center', maxHeight: 340 }}
                className="max-w-full object-contain"
              />
            </ReactCrop>
          </div>

          <div className="w-full space-y-1.5">
            <p className="text-xs text-muted-foreground">Thu phóng</p>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={[scale]}
              onValueChange={([v]) => setScale(v)}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!completedCrop || isPending}>
            {isPending ? 'Đang tải lên…' : 'Lưu ảnh'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
