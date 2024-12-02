'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { usePinterestStore } from '@/lib/store'
import { withAuth } from '@/components/withAuth'
import { toast } from 'react-hot-toast'
import { Pin, PinterestBoard } from '@/types'

interface ScheduleFormData {
  title: string
  description: string
  link: string
  imageUrl: string
  boardId: string
  scheduledTime: string
}

function SchedulePage() {
  const { boards } = usePinterestStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleFormData>()

  const onSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/pinterest/schedule-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to schedule pin')
      }

      toast.success('Pin scheduled successfully!')
    } catch (error) {
      console.error('Error scheduling pin:', error)
      toast.error('Failed to schedule pin. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Schedule a Pin</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="mt-1"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            className="mt-1"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link</label>
          <Input
            id="link"
            type="url"
            {...register('link', { required: 'Link is required' })}
            className="mt-1"
          />
          {errors.link && <p className="mt-1 text-sm text-red-600">{errors.link.message}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <Input
            id="imageUrl"
            type="url"
            {...register('imageUrl', { required: 'Image URL is required' })}
            className="mt-1"
          />
          {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
        </div>

        <div>
          <label htmlFor="boardId" className="block text-sm font-medium text-gray-700">Board</label>
          <Select
            id="boardId"
            {...register('boardId', { required: 'Board is required' })}
            className="mt-1"
          >
            <option value="">Select a board</option>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>{board.name}</option>
            ))}
          </Select>
          {errors.boardId && <p className="mt-1 text-sm text-red-600">{errors.boardId.message}</p>}
        </div>

        <div>
          <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">Scheduled Time</label>
          <Input
            id="scheduledTime"
            type="datetime-local"
            {...register('scheduledTime', { required: 'Scheduled time is required' })}
            className="mt-1"
          />
          {errors.scheduledTime && <p className="mt-1 text-sm text-red-600">{errors.scheduledTime.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Scheduling...' : 'Schedule Pin'}
        </Button>
      </form>
    </div>
  )
}

export default withAuth(SchedulePage)

