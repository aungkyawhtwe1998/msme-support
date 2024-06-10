import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TransactionType } from "../types/Transaction";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns"; // Import isValid function

interface TransactionFormValues {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
}

interface TransactionFormProps {
  initialValues: TransactionFormValues;
  onSubmit: (values: TransactionFormValues, { setSubmitting }: any) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialValues,
  onSubmit,
}) => {
  const initialDate = initialValues.date
    ? parse(initialValues.date, "dd-MM-yyyy", new Date())
    : new Date();

  const [date, setDate] = React.useState<Date>(initialDate);

  const validationSchema = Yup.object({
    amount: Yup.number().required("Amount is required"),
    description: Yup.string().optional(),
    date: Yup.string().optional(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        if (!values.date) {
          values.date = format(new Date(), "dd-MM-yyyy");
        }
        onSubmit(values, { setSubmitting });
      }}
      enableReinitialize>
      {({ isSubmitting, setFieldValue }) => (
        <Form className="w-full">
          <h2 className="text-2xl text-center mb-4">Add New Transaction</h2>
          <div className="mb-4">
            <label className="block mb-1">Amount</label>
            <Field
              name="amount"
              type="number"
              as={Input}
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="amount"
              component="div"
              className="text-red-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Description</label>
            <Field
              name="description"
              as={Input}
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd-MM-yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate instanceof Date) {
                      setDate(selectedDate);
                      setFieldValue("date", format(selectedDate, "dd-MM-yyyy"));
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <ErrorMessage
              name="date"
              component="div"
              className="text-red-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-5 bg-blue-500 text-white p-2 rounded">
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default TransactionForm;
