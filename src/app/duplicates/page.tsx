
import DuplicatesDashboard from '@/components/duplicates-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DuplicatesPage() {
  return (
    <div className="space-y-6 py-6">
       <Card>
            <CardHeader>
                <CardTitle>Duplicates Finder</CardTitle>
                <CardDescription>
                    Start a new scan to find and remove duplicate files, reclaiming valuable disk space.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DuplicatesDashboard />
            </CardContent>
        </Card>
    </div>
  );
}
