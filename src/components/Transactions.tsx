import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Transaction, TransactionType } from "../types/Transaction";
import TransactionForm from "./TransactionForm";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "./ui/use-toast";
import useTransaction from "../hooks/useTransaction";
import Pagination from "./Pagination";
import { Edit2Icon, Trash2Icon } from "lucide-react";

const Transactions = () => {
  const {
    transactions,
    loading,
    error,
    getFilteredTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransaction();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 10;
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<TransactionType>(
    TransactionType.INCOME
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => transaction.type === activeTab);
  }, [transactions, activeTab]);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "amount", header: "Amount($)" },
      { accessorKey: "description", header: "Description" },
      { accessorKey: "date", header: "Date" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <>
            <Button
              className="mr-2 "
              variant={"link"}
              onClick={() => handleEditTransaction(row.original)}>
              <Edit2Icon className="hover:text-yellow-600" />
            </Button>
            <Button
              variant="link"
              className=""
              onClick={() => handleClickDelete(row.original)}>
              <Trash2Icon className="hover:text-red-500" />
            </Button>
          </>
        ),
      },
    ],
    []
  );

  const handleTabChange = (type: TransactionType) => {
    setActiveTab(type);
    getFilteredTransactions(type);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleClickDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (selectedTransaction)
      try {
        await deleteTransaction(selectedTransaction?.id);
        toast({
          description: "Transaction deleted successfully!",
          className:
            "bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2",
        });
        setIsConfirmDialogOpen(false);
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast({ description: "Failed to delete transaction" });
        setIsConfirmDialogOpen(false);
      }
  };

  const handleSubmit = async (values: Transaction, { setSubmitting }: any) => {
    try {
      if (selectedTransaction) {
        await updateTransaction(selectedTransaction.id, {
          ...values,
          type: activeTab,
        });
        toast({
          description: "Transaction updated successfully!",
          className:
            "bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2",
        });
      } else {
        await addTransaction({ ...values, type: activeTab });
        toast({
          description: "Transaction added successfully!",
          className:
            "bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2",
        });
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast({ description: "Failed to save transaction" });
    } finally {
      setSubmitting(false);
      setIsDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  let initialValues = selectedTransaction || {
    id: "",
    amount: 0,
    description: "",
    userId: user?.uid,
    date: "",
    type: activeTab,
  };

  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage);
  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
  }, [filteredTransactions]);
  const paginatedData = useMemo(() => {
    const startIndex = pageIndex * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, pageIndex]);
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (error)
    return (
      <p className="text-red-500">
        Something went wrong? Please contact the support team!
      </p>
    );

  return (
    <div className="w-full h-full overflow-y-scroll p-4">
      <h1 className="text-3xl text-gray-700 border-b border-gray-100 pb-5 font-extrabold mb-5">
        Transaction <span className="text-blue-600">Logs</span>
      </h1>{" "}
      <Dialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <p className="text-lg">
            Are you sure you want to delete this transaction?
          </p>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="ml-2"
              onClick={handleDeleteTransaction}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Tabs
        defaultValue={activeTab}
        onValueChange={(value: string) =>
          handleTabChange(value as TransactionType)
        }>
        <div className="flex gap-5 flex-col xl:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger
              className="w-full"
              value={TransactionType.INCOME}>
              Income
            </TabsTrigger>
            <TabsTrigger
              className="w-full"
              value={TransactionType.EXPENSE}>
              Expense
            </TabsTrigger>
          </TabsList>
          <div className="flex justify-between w-full md:w-auto gap-5 items-center">
            <span
              className={`${
                activeTab === TransactionType.INCOME
                  ? "text-gray-700"
                  : "text-red-500"
              } ' font-extrabold text-3xl'`}>
              Total: {totalAmount.toLocaleString()} $
            </span>
            <Dialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                onClick={() => setSelectedTransaction(null)}
                className="border border-gray-700 text-gray-700 py-2 px-5 rounded-lg hover:bg-gray-100">
                + Add New
              </DialogTrigger>
              <DialogContent>
                <TransactionForm
                  key={selectedTransaction ? selectedTransaction.id : "new"}
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-xl my-10">Loading...</p>
        ) : table && table.getRowModel().rows.length > 0 ? (
          <TabsContent
            value={activeTab}
            className="">
            <div className="overflow-atuo w-full ">
              <Table className="min-w-full">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          className="font-bold text-md"
                          key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          className="text-nowrap"
                          key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              pageCount={pageCount}
              dataLength={filteredTransactions.length}
              itemsPerPage={itemsPerPage}
            />
          </TabsContent>
        ) : (
          <p className="text-center text-xl my-10">No data</p>
        )}
      </Tabs>
    </div>
  );
};

export default Transactions;
