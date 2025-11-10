
import React from "react";
import {Check, ChevronDown} from "lucide-react";
import {Button} from "@mui/material";
import {DropdownMenu} from "../Layout/DropdownMenu/DropdownMenu";
import {DropdownMenuTrigger} from "../Layout/DropdownMenu/DropdownMenuTrigger";
import {DropdownMenuContent} from "../Layout/DropdownMenu/DropdownMenuContext";
import {DropdownMenuItem} from "../Layout/DropdownMenu/DropdownMenuItem";

interface Prompt {
    id: string;
    title: string;
    description?: string;
}

interface PromptSelectorProps {
    prompts: Prompt[];
    selectedPromptId?: string;
    onSelectPrompt: (promptId: string) => void;
}


export default function PromptSelector({
                                           prompts,
                                           selectedPromptId,
                                           onSelectPrompt,
                                       }: PromptSelectorProps) {
    const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="w-full justify-between gap-2">
          <span className="text-sm font-medium">
            {selectedPrompt ? selectedPrompt.title : "Select a prompt..."}
          </span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-64">
                {prompts.map((prompt) => {
                    const isSelected = prompt.id === selectedPromptId;

                    return (
                        <DropdownMenuItem
                            key={prompt.id}
                            onClick={() => onSelectPrompt(prompt.id)}
                            className="flex flex-col gap-1 p-3 cursor-pointer"
                            data-testid={`prompt-option-${prompt.id}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{prompt.title}</span>
                                {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </div>
                            {prompt.description && (
                                <p className="text-xs text-muted-foreground">{prompt.description}</p>
                            )}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}