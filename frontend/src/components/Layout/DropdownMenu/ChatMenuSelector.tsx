
import { Check, ChevronDown, Sparkles, Zap, TreeDeciduous } from "lucide-react";
import {DropdownMenu} from "./DropdownMenu";
import {DropdownMenuContent} from "./DropdownMenuContext";
import {DropdownMenuItem} from "./DropdownMenuItem";
import {DropdownMenuTrigger} from "./DropdownMenuTrigger";
import {Button} from "@mui/material";

export interface AIModel {
    id: string;
    name: string;
    description: string;
    icon: "sparkles" | "zap" | "tree";
}

interface ModelSelectorProps {
    models: AIModel[];
    selectedModelId: string;
    onSelectModel: (modelId: string) => void;
}

const iconMap = {
    sparkles: Sparkles,
    zap: Zap,
    tree: TreeDeciduous,
};

export default function ChatMenuSelector({models, selectedModelId, onSelectModel}: ModelSelectorProps) {
    const selectedModel = models.find((m) => m.id === selectedModelId);
    const Icon = selectedModel ? iconMap[selectedModel.icon] : Sparkles;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="gap-2"
                    data-testid="button-model-selector"
                >
                    <Icon className="size-18" />
                    <span className="text-lg font-medium text-gray-800">{selectedModel?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
                {models.map((model) => {
                    const ModelIcon = iconMap[model.icon];
                    const isSelected = model.id === selectedModelId;

                    return (
                        <DropdownMenuItem
                            key={model.id}
                            onClick={() => onSelectModel(model.id)}
                            className="flex items-start gap-3 p-3 cursor-pointer"
                            data-testid={`model-option-${model.id}`}
                        >
                            <ModelIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-medium">{model.name}</span>
                                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {model.description}
                                </p>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}