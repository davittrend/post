import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Scheduler() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Schedule a Pin</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <Input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea id="description" name="description" rows={3} required />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
          <Input type="url" id="image" name="image" required />
        </div>
        <div>
          <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">Scheduled Time</label>
          <Input type="datetime-local" id="scheduledTime" name="scheduledTime" required />
        </div>
        <Button type="submit">Schedule Pin</Button>
      </form>
    </div>
  );
}

