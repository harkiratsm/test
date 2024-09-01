import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X as CrossIcon, UploadIcon } from "lucide-react";
import { useToast } from './ui/use-toast';
import { Toaster } from './ui/toaster';
import { axios_api } from '@/libs/utils';

export interface UploadDialogProps {
  className?: string;
  open?: boolean;
  setOpen: (open: boolean) => void;
}


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
];

const fileSchema = z.object({
  0: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
    .refine(file => ACCEPTED_FILE_TYPES.includes(file.type), "Only Excel (XLSX, XLS), and CSV files are accepted.")
});

const UploadDocumentSchema = z.object({
  paymentReport: fileSchema,
  mtrReport: fileSchema,
});

type UploadDocumentSchemaType = z.infer<typeof UploadDocumentSchema>;

export function UploadDialog({ className, open, setOpen}: UploadDialogProps) {
  const router = useRouter();
  const { toast } = useToast()
  

  const form = useForm<UploadDocumentSchemaType>({
    resolver: zodResolver(UploadDocumentSchema),
  });

  const onSubmit = async (data: UploadDocumentSchemaType) => {
    try {
      const formData = new FormData();
      formData.append('payment_file', data.paymentReport[0]);
      formData.append('mtr_file', data.mtrReport[0]);

      await axios_api.post('/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'File uploaded.',
        description: 'Your file has been uploaded successfully.',
      });
      
      setOpen(false);
      // just an hack rn, will fix it later
      router.refresh();

    } catch (error) {
      console.error(error)
      toast ({
        title: 'Error',
        description: 'An error occurred while uploading your file. Please try again later.',
        duration: 5000,
      }); 
    }
  };

  const FileChip = ({ file, onRemove }: { file: File; onRemove: () => void }) => (
    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm">
      <span className="truncate max-w-[150px]">{file.name}</span>
      <button 
        onClick={onRemove} 
        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full"
      >
        <CrossIcon className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className='mt-2 ml-4 text-muted-foreground'>
          <UploadIcon className="mr-2 h-5 w-5" />
          Upload Files
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Reports</DialogTitle>
          <DialogDescription>Submit both your payment report and merchant tax report (MTR) here.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={form.formState.isSubmitting} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="paymentReport"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel htmlFor="payment-report">Payment Report</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {value && value[0] ? (
                          <div className="flex items-center justify-between w-full">
                            <FileChip 
                              file={value[0]} 
                              onRemove={() => onChange(undefined)} 
                            />

                          </div>
                        ) : (
                          <Input 
                            id="payment-report" 
                            type="file" 
                            className="flex-1"
                            onChange={(e) => onChange(e.target.files)}
                            accept=".xlsx,.xls,.csv"
                            required
                            {...rest}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>Upload your payment report file here  (Excel, or CSV, max 5MB).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mtrReport"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel htmlFor="mtr-report">Merchant Tax Report (MTR)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {value && value[0] ? (
                          <div className="flex items-center justify-between w-full">
                            <FileChip 
                              file={value[0]} 
                              onRemove={() => onChange(undefined)} 
                            />
  
                          </div>
                        ) : (
                          <Input 
                            id="mtr-report" 
                            type="file" 
                            className="flex-1"
                            onChange={(e) => onChange(e.target.files)}
                            accept=".xlsx,.xls,.csv"
                            required
                            {...rest}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>Upload your merchant tax report file here (Excel, or CSV, max 5MB).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" className="bg-purple text-white" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Uploading...' : 'Upload Reports'}
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    <Toaster/>
    </>
  );
}