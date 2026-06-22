import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, ShoppingBag, MapPin, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { createOrderSchema, type CreateOrderSchema } from '../../schemas/create-order.schema'
import { MOCK_AVAILABLE_PRODUCTS } from '../../mocks/customer-orders.mock'
import { cn } from '@/lib/utils'

interface CreateOrderModalProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly onSubmit: (data: CreateOrderSchema) => void
}

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

export function CreateOrderModal({ open, onOpenChange, onSubmit }: CreateOrderModalProps) {
  const form = useForm<CreateOrderSchema>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      products: [{ productId: '', quantity: 1 }],
      shippingAddress: '',
      note: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  })

  // Compute estimated total from selected products
  const watchedProducts = form.watch('products')
  const estimatedTotal = watchedProducts.reduce((sum, item) => {
    const product = MOCK_AVAILABLE_PRODUCTS.find((p) => p.id === item.productId)
    return sum + (product ? product.unitPrice * (item.quantity || 0) : 0)
  }, 0)

  const handleSubmit = (data: CreateOrderSchema) => {
    onSubmit(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border/60 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-background/95">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            Tạo Đơn Hàng Mới
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form id="create-order-form" onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
            {/* Product lines */}
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground/90">Sản phẩm yêu cầu</p>
              <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2.5 p-2 rounded-xl border border-border/40 bg-muted/10 transition-all hover:bg-muted/20">
                    <FormField
                      control={form.control}
                      name={`products.${index}.productId`}
                      render={({ field: selectField }) => (
                        <FormItem className="flex-1">
                          {index === 0 && <FormLabel className="sr-only">Sản phẩm</FormLabel>}
                          <Select onValueChange={selectField.onChange} value={selectField.value}>
                            <FormControl>
                              <SelectTrigger className="border-border/60 hover:bg-background transition-colors">
                                <SelectValue placeholder="Chọn sản phẩm" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MOCK_AVAILABLE_PRODUCTS.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} — <span className="font-semibold text-primary">{formatVND(product.unitPrice)}</span>/{product.unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`products.${index}.quantity`}
                      render={({ field: qtyField }) => (
                        <FormItem className="w-28">
                          {index === 0 && <FormLabel className="sr-only">Số lượng</FormLabel>}
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              placeholder="SL"
                              className="border-border/60 hover:bg-background transition-colors"
                              {...qtyField}
                              onChange={(event) => qtyField.onChange(Number(event.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      aria-label="Xoá dòng sản phẩm"
                    >
                      <Trash2 className="h-4.5 w-4.5" aria-hidden />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 gap-1.5 border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 transition-all rounded-lg"
                onClick={() => append({ productId: '', quantity: 1 })}
              >
                <Plus className="h-4 w-4" aria-hidden />
                Thêm dòng sản phẩm
              </Button>
            </div>

            <Separator className="bg-border/60" />

            {/* Estimated total */}
            {estimatedTotal > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 px-4 py-3.5 shadow-sm animate-in fade-in slide-in-from-top-1">
                <span className="text-sm font-semibold text-foreground/80">Tạm tính (chưa chiết khấu)</span>
                <span className="text-lg font-bold text-primary">{formatVND(estimatedTotal)}</span>
              </div>
            )}

            {/* Shipping address */}
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="flex items-center gap-1.5 font-semibold text-foreground/90">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Địa chỉ giao hàng
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="vd: 123 Nguyễn Văn Linh, Q.7, TP.HCM" 
                      className="border-border/60 hover:border-border transition-colors"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Note */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="flex items-center gap-1.5 font-semibold text-foreground/90">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Ghi chú (tùy chọn)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Giao giờ hành chính, liên hệ trước khi giao..."
                      className="min-h-[72px] resize-none border-border/60 hover:border-border transition-colors rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="pt-2 gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="rounded-lg transition-colors border-border hover:bg-muted"
          >
            Hủy bỏ
          </Button>
          <Button 
            type="submit" 
            form="create-order-form"
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all"
          >
            Xác nhận đặt hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

