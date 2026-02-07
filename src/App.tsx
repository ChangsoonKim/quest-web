import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function App() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Quest Web</CardTitle>
          <CardDescription>프로젝트가 성공적으로 설정되었습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="퀘스트를 검색하세요..." />
          <Button className="w-full">시작하기</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
