"use client";
import { Suspense, useState } from "react";
import { ApprovalTables } from "./ApprovalTables";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "tabler-icons-react";
import { ApprovalDetails } from "./ApprovalDetails";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const Page = () => {
  const { toast } = useToast();
  const query = useSearchParams();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["approvals", query.toString()],
    queryFn: async () => {
      const res = await fetch("/api/approvals?" + query.toString());
      return res.json();
    },
  });

  const [stockAllocationId, setStockAllocationId] = useState<string>("");

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <div className="container">
        <div className="py-8">
          <div>
            <h1 className="text-xl">Approvals</h1>
            {isLoading ? (
              <Loader2 className="animate-spin my-4" />
            ) : (
              <ApprovalTables
                // stockAllocationId={setStockAllocationId}
                // setStockAllocationId={setStockAllocationId}
                selected={stockAllocationId}
                onClick={setStockAllocationId}
                data={data?.approvals}
              />
            )}
          </div>
        </div>
        <Dialog
          open={!!stockAllocationId}
          onOpenChange={(open) => {
            setStockAllocationId((prev) => (open ? prev : ""));
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approval Details</DialogTitle>
            </DialogHeader>

            <ApprovalDetails refetch={refetch} selected={stockAllocationId} />
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  );
};

export default Page;
