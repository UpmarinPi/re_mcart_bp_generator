import React from "react";
import { DropdownComponent } from "../DropdownComponent/DropdownComponent";
import "./DropdownWithImageComponent.css";

export interface IImageOption {
    value: string;
    label: string;
    imageUrl?: string;
}

export class DropdownWithImageComponent extends DropdownComponent {
    protected _imageOptions: IImageOption[] = [];
    protected isOpen: boolean = false;
    protected selectedValue: string = "";

    // override to work with the custom options since base doesn't expose it
    private set imageOptions(value: IImageOption[]) {
        this._imageOptions = value;
        // set selected to first option by default
        if (this._imageOptions.length > 0 && !this.selectedValue) {
            this.selectedValue = this._imageOptions[0].value;
        }
        this.requestsRenderUpdate.notify();
    }

    override SetValue(value: string) {
        let valid = false;
        for (const option of this._imageOptions) {
            if (option.value === value) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            console.error(`there has no value for ${value}`);
            return;
        }
        this.selectedValue = value;
        this.requestsRenderUpdate.notify();
    }

    override AddValue(value: string, label: string, imageUrl?: string) {
        this._imageOptions.push({ value, label, imageUrl });
        // If it's the first option added, select it
        if (this._imageOptions.length === 1) {
            this.selectedValue = value;
        }
        this.requestsRenderUpdate.notify();
    }

    override ResetValues() {
        this._imageOptions = [];
        this.selectedValue = "";
        this.requestsRenderUpdate.notify();
    }

    override GetCurrentSelect(): string {
        return this.selectedValue;
    }

    constructor(id: string = "", options: IImageOption[] = []) {
        super(id, []); // Base dropdown expects IOption
        this.imageOptions = options;
    }

    override GetRender(): React.JSX.Element {
        return <DropdownWithImageInner key={this.id} component={this} />
    }
}

function DropdownWithImageInner({ component }: { component: DropdownWithImageComponent }) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Auto-update when component requests render
    const [, forceRender] = React.useState({});
    React.useEffect(() => {
        const token = component.requestsRenderUpdate.Subscribe(() => forceRender({}));
        return () => {
            // Note: ObserverSubject in this codebase doesn't seem to have Unsubscribe.
            // Assuming we just leave it for now or if memory leaks occur, we need Unsubscribe.
        };
    }, [component]);

    // Handle clicking outside to close
    React.useEffect(() => {
        const handleClickOutside = () => setIsOpen(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleSelect = (value: string) => {
        component.SetValue(value);
        setIsOpen(false);
    };

    // We expose a getter for selected value and options in the class to access here easily
    // Since they are protected, we can cheat a little in TS or just add getters.
    // For now, let's cast to any to access protected members if necessary, or better, add public getters.
    const options = (component as any)._imageOptions as IImageOption[];
    const selectedValue = (component as any).selectedValue as string;

    const selectedOption = options.find(opt => opt.value === selectedValue) || options[0];

    return (
        <div
            className={`dropdown-with-image-component ${component.id}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="dropdown-with-image-selected" onClick={toggleOpen}>
                <div className="dropdown-with-image-item-content">
                    {selectedOption?.imageUrl && (
                        <img src={selectedOption.imageUrl} alt={selectedOption.label} className="dropdown-with-image-icon" />
                    )}
                    <span>{selectedOption?.label || "Select..."}</span>
                </div>
                <span className="dropdown-with-image-arrow">▼</span>
            </div>
            {isOpen && (
                <div className="dropdown-with-image-menu">
                    {options.map(option => (
                        <div
                            key={option.value}
                            className={`dropdown-with-image-option ${option.value === selectedValue ? 'selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            <div className="dropdown-with-image-item-content">
                                {option.imageUrl && (
                                    <img src={option.imageUrl} alt={option.label} className="dropdown-with-image-icon" />
                                )}
                                <span>{option.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

