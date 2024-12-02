import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function ScheduledPins() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Scheduled Pins</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Scheduled Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="text-center">No scheduled pins yet.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

