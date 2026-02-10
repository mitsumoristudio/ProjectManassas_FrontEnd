
import React from "react";

import cn from "../../util/util";
import {Upload, FileSpreadsheet, XOctagon, BadgeCheckIcon} from "lucide-react";
import {Button} from "@mui/material";

export interface UploadExcelIngestionProps {
    id: string;
    fileName: string;
    size: string;
    type: string;
    status?: "uploading" | "analyzed" | "error";
}

interface ExcelIngestionProps {
    documents: UploadExcelIngestionProps [];
    onUpload?: (file: FileList) => void;
    onRemove?: (id: string) => void;
    maxFiles?: number;
}

export default function ExcelIngestion({ documents, onUpload, onRemove, maxFiles = 5}: ExcelIngestionProps) {

    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && onUpload) {
            onUpload(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && onUpload) {
            onUpload(e.target.files);
        }
    };


    return (


        <main>
            <div className={"space-y-4"}
            >
                <div className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                )}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     onDrop={handleDrop}
                >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                        Upload Excel Files
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                        Drag and drop Excel files here, or click to browse
                    </p>

                    <input
                        type={"file"}
                        accept={".xlsx,.xls,.csv"}
                        multiple
                        onChange={handleFileInput}
                        className={"hidden"}
                        id = "excel-upload">
                    </input>

                    <label htmlFor="excel-upload">
                        <Button variant={"outlined"} component={"span"} size={"small"} startIcon={<Upload />}>
                            Select Excel Files
                        </Button>
                    </label>

                    <p className="text-xs my-2 text-muted-foreground">
                        XLSX, XLS, CSV (Max {maxFiles} files)
                    </p>

                </div>

                {/* Uploaded list */}
                {documents.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">
                            Uploaded Excel Files ({documents.length})
                        </h4>
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-3 p-3 border border-border rounded-lg hover-elevate"
                                data-testid={`document-${doc.id}`}
                            >
                                <FileSpreadsheet className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {doc.fileName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {doc.type} • {doc.size}
                                    </p>
                                </div>

                                {/* Status indicator */}
                                <div className="flex items-center gap-1">
                                    {doc.status === "uploading" && (
                                        <span className="text-blue-500 text-xs">Uploading...</span>
                                    )}
                                    {doc.status === "analyzed" && (
                                        <span className="flex items-center text-green-600 text-xs font-medium">
                                            <BadgeCheckIcon className="h-4 w-4 mr-1" /> Analyzed
                                        </span>
                                    )}
                                    {doc.status === "error" && (
                                        <span className="text-red-500 text-xs">Error</span>
                                    )}
                                </div>

                                <BadgeCheckIcon className="flex-shrink-0">
                                    Analyzed
                                </BadgeCheckIcon>

                                {/*Remove Excel button */}
                                {onRemove && (
                                    <Button variant={"outlined"}
                                            size={"small"}
                                            onClick={() => onRemove(doc.id)}>
                                        <XOctagon className={"h-4 w-4"} />
                                        )
                                    </Button>
                                )}

                            </div>
                        ))}
                    </div>
                )}



            </div>
        </main>
    )
}