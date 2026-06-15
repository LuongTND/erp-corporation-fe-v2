import { Check } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import type { PriorityFormData } from '../../../schemas/priority.schema'

interface PriorityFormProps {
  form: UseFormReturn<PriorityFormData>
  isSubmitting: boolean
  isEditing: boolean
  onCancel: () => void
  onSubmit: (data: PriorityFormData) => void
}

export function PriorityForm({ form, isSubmitting, isEditing, onCancel, onSubmit }: PriorityFormProps) {
  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-lg mx-auto w-full h-full flex flex-col justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Tên hiển thị</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ví dụ: Quan trọng"
                          {...field}
                          className="h-11 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel>Mã định danh</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="HIGH"
                          className="h-11 font-mono uppercase focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mức độ ưu tiên</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Chọn mức độ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((level) => (
                            <SelectItem key={level} value={level.toString()}>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="w-6 h-6 rounded-full p-0 flex items-center justify-center"
                                >
                                  {level}
                                </Badge>
                                Level {level}
                              </div>
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
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Màu đại diện</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3 h-11 w-full border rounded-md px-3 bg-card focus-within:ring-2 ring-ring transition-all">
                          <div className="relative flex items-center justify-center shrink-0">
                            <Input
                              type="color"
                              className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer overflow-hidden scale-110 opacity-0 absolute inset-0 z-10"
                              {...field}
                            />
                            <div
                              className="w-6 h-6 rounded-full border shadow-sm pointer-events-none ring-1 ring-offset-1 ring-offset-background"
                              style={{ backgroundColor: field.value }}
                            />
                          </div>
                          <Separator orientation="vertical" className="h-6" />
                          <Input
                            {...field}
                            className="border-0 p-0 h-full bg-transparent font-mono uppercase text-sm focus-visible:ring-0"
                            maxLength={7}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      </ScrollArea>

      <div className="p-4 py-5 border-t bg-background/50 backdrop-blur-sm shrink-0 flex justify-center">
        <div className="flex gap-4 w-full max-w-lg">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-spin mr-2">⟳</span>
            ) : (
              <Check className="w-5 h-5 mr-2" />
            )}
            {isEditing ? 'Lưu thay đổi' : 'Tạo Priority'}
          </Button>
        </div>
      </div>
    </>
  )
}
