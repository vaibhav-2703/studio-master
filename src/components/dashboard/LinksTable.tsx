
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, QrCode, Copy, Trash2, Edit, Check, ArrowUpDown, Download, Rocket } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { QrCodeDialog } from "./QrCodeDialog";
import { EditLinkDialog } from "./EditLinkDialog";
import { useToast } from "@/hooks/use-toast";
import { LinkData } from "@/lib/types";
import { deleteLink } from "@/lib/data-service";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AnimatedDiv } from "../shared/AnimatedDiv";

interface LinksTableProps {
  links: LinkData[];
  onLinkDeleted: (id: string) => void;
  onLinkUpdated: (link: LinkData) => void;
}

export function LinksTable({ links, onLinkDeleted, onLinkUpdated }: LinksTableProps) {
  const [selectedLinkForQr, setSelectedLinkForQr] = useState<LinkData | null>(null);
  const [selectedLinkForEdit, setSelectedLinkForEdit] = useState<LinkData | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<LinkData | null>(null);
  const [copiedAlias, setCopiedAlias] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { toast } = useToast();

  const getFullShortUrl = (alias: string) => (typeof window === 'undefined' ? '' : `${window.location.origin}/${alias}`);

  const handleCopy = (alias: string) => {
    if (typeof window === 'undefined') return;
    const fullUrl = getFullShortUrl(alias);
    navigator.clipboard.writeText(fullUrl);
    setCopiedAlias(alias);
    toast({ title: "Copied!", description: "The link has been copied to your clipboard." });
    setTimeout(() => setCopiedAlias(null), 2000);
  };

  const handleEdit = (link: LinkData) => { setSelectedLinkForEdit(link); setIsEditDialogOpen(true); };
  const handleGetQrCode = (link: LinkData) => { setSelectedLinkForQr(link); setIsQrDialogOpen(true); };
  const confirmDelete = (link: LinkData) => { setLinkToDelete(link); setIsDeleteDialogOpen(true); };

  const handleDelete = async () => {
    if (!linkToDelete) return;
    try {
      await deleteLink(linkToDelete.id);
      toast({ title: "Deleted", description: "Link has been deleted." });
      onLinkDeleted(linkToDelete.id);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete the link." });
    } finally {
      setIsDeleteDialogOpen(false);
      setLinkToDelete(null);
    }
  };

  const columns: ColumnDef<LinkData>[] = [
    {
      accessorKey: "name",
      header: "Link",
      cell: ({ row }) => {
        const link = row.original;
        const fullShortUrl = getFullShortUrl(link.alias);
        return (
          <div className="font-medium">
            <div className="font-semibold">{link.name}</div>
            <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary text-sm">
              {fullShortUrl}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "originalUrl",
      header: () => <div className="hidden md:table-cell">Destination</div>,
      cell: ({ row }) => {
        const link = row.original;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="hidden md:table-cell max-w-sm truncate">
                  <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {link.originalUrl}
                  </a>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.originalUrl}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "clicks",
      header: ({ column }) => (
        <div className="hidden sm:table-cell text-center">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Clicks <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="hidden sm:table-cell text-center">
          <Badge variant="secondary">{row.original.clicks.toLocaleString()}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="hidden md:table-cell">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Created At <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="hidden md:table-cell text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const link = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(link.alias)}>
                    {copiedAlias === link.alias ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy Link</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleGetQrCode(link)}>
                    <QrCode className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Get QR Code</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(link)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => confirmDelete(link)} className="text-red-500 focus:text-red-500 focus:bg-red-500/10"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: links,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting },
  });

  if (links.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-full text-center py-10">
        <div className="relative">
          <Rocket className="w-16 h-16 text-primary" />
          <div className="absolute inset-0 w-16 h-16 bg-primary/10 rounded-full blur-sm" />
        </div>
        <p className="text-base font-semibold mt-4">No links yet</p>
        <p className="text-muted-foreground mt-2">Create your first short URL to get started.</p>
      </div>
    );
  }

  const exportCsv = () => {
    const header = ["Name", "Alias", "Original URL", "Clicks", "Created At"];
    const csvRows = links.map(l => [l.name, l.alias, l.originalUrl, String(l.clicks), l.createdAt]);
    const csv = [header, ...csvRows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `links-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Total links: {links.length}</div>
        <Button variant="outline" size="sm" onClick={exportCsv} aria-label="Export CSV" title="Export CSV">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-full rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <AnimatedDiv
                  tag="tr"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
                  delay={index * 0.05}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </AnimatedDiv>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
      </div>

      {selectedLinkForQr && (
        <QrCodeDialog
          isOpen={isQrDialogOpen}
          onOpenChange={setIsQrDialogOpen}
          link={{ ...selectedLinkForQr, shortUrl: `/${selectedLinkForQr.alias}` }}
        />
      )}

      {selectedLinkForEdit && (
        <EditLinkDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          link={selectedLinkForEdit}
          onLinkUpdated={onLinkUpdated}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your link and its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
