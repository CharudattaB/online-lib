import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  Resource,
  StockAllocation,
  StockAllocationHistory,
  StockAllocationStatus,
  User,
} from "@prisma/client";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

interface Props {
  selected: string;
  refetch: () => void;
}

type Data = {
  approval: StockAllocation & {
    resource: Resource;
    StockAllocationHistory: Array<StockAllocationHistory>;
    allocatedTo: User;
    allocatedBy: User;
  };
};
export const ApprovalDetails = ({ selected, refetch: refetchList }: Props) => {
  const { toast } = useToast();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["approval", selected],
    queryFn: async () => {
      const res = await fetch("/api/approvals/" + selected);
      return res.json() as Promise<Data>;
    },
    enabled: !!selected,
  });

  const [remark, setRemark] = useState("");
  const [otp, setOtp] = useState("");

  const { mutate: approve, isPending: isApprovePending } = useMutation({
    mutationKey: ["books/assign"],
    mutationFn: async (payload: object) => {
      // post to /api/resources/:id/register
      // @ts-ignore
      const res = await fetch(
        "/api/resources/" + selected + "/actions/assign",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book Assigned",
      });
      refetch();
      // close modal
      // onClic("");
    },
    onError: (err) => {
      toast({
        title: err.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: reject, isPending: isRejectPending } = useMutation({
    mutationKey: ["books/reject", selected],
    mutationFn: async (payload: object) => {
      // post to /api/resources/:id/register
      const res = await fetch(
        "/api/resources/" + selected + "/actions/reject",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book Rejected",
      });
      refetch();
      refetchList();
      // close modal
      // setStockAllocationId("");
    },
    onError: (err) => {
      toast({
        title: err.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: returnBook, isPending: isReturnPending } = useMutation({
    mutationKey: ["books/reject", selected],
    mutationFn: async (payload: object) => {
      // post to /api/resources/:id/register
      const res = await fetch(
        "/api/resources/" + selected + "/actions/return",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Book Returned",
      });
      refetch();
      refetchList();
      // close modal
      // setStockAllocationId("");
    },
    onError: (err) => {
      toast({
        title: err.message,
        variant: "destructive",
      });
    },
  });

  const renderFooter = ![
    StockAllocationStatus.Returned,
    StockAllocationStatus.Rejected,
  ].includes(data?.approval?.status as any);

  const renderReject =
    StockAllocationStatus.Registered === data?.approval?.status;

  const renderApprove =
    StockAllocationStatus.Registered === data?.approval?.status;

  const renderReturned = [
    StockAllocationStatus.Overdue,
    StockAllocationStatus.Approved,
  ].includes(data?.approval?.status as any);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DialogDescription>
            <Tabs defaultValue="details">
              <TabsList className="w-full my-2">
                <TabsTrigger className="w-full" value="details">
                  Details
                </TabsTrigger>
                <TabsTrigger className="w-full" value="history">
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="flex text-lg flex-col gap-1 h-[30vh]">
                  <h2>
                    <span className="inline-block w-24">Book Name </span> :{" "}
                    {data?.approval?.resource.title}
                  </h2>
                  <p>
                    <span className="inline-block w-24">ISBN </span> :{" "}
                    {data?.approval?.resource.isbn}
                  </p>
                  <p>
                    <span className="inline-block w-24">Status </span> :{" "}
                    <Badge>{data?.approval?.status}</Badge>
                  </p>
                  <p>
                    <span className="inline-block w-24">To </span> :{" "}
                    {data?.approval?.allocatedTo?.name}
                  </p>
                  <p>
                    <span className="inline-block w-24">From </span> :
                    {data?.approval?.allocatedBy?.name}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="history">
                <div className="flex flex-col gap-1 h-[40vh]">
                  <div className="flex flex-col gap-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.approval?.StockAllocationHistory.map(
                          (history) => (
                            <TableRow key={history.id}>
                              <TableCell>
                                {new Date(
                                  history.createdAt
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge>{history.action}</Badge>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogDescription>

          {renderFooter && (
            <>
              <Label>Remark</Label>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
              <Label className="block mt-4 mb-2">OTP (Only for approval)</Label>
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} />
            </>
          )}

          {renderFooter && (
            <DialogFooter className="mt-2">
              {renderReturned && (
                <Button
                  variant="destructive"
                  onClick={() =>
                    returnBook({ stockAllocationId: selected, remark })
                  }
                >
                  Return Book
                </Button>
              )}
              {renderReject && (
                <Button
                  variant="destructive"
                  onClick={() =>
                    reject({ stockAllocationId: selected, remark })
                  }
                >
                  Reject
                </Button>
              )}
              {renderApprove && (
                <Button
                  onClick={() =>
                    approve({ stockAllocationId: selected, otp, remark })
                  }
                >
                  Approve
                </Button>
              )}
            </DialogFooter>
          )}
        </>
      )}
    </div>
  );
};
