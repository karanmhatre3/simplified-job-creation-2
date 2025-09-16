import React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const languages = [
  { value: "en-US", label: "English (US) [en-US]" },
  { value: "en-UK", label: "English (UK) [en-UK]" },
  { value: "es-ES", label: "Spanish (Spain) [es-ES]" },
  { value: "es-MX", label: "Spanish (Mexico) [es-MX]" },
  { value: "fr-FR", label: "French (France) [fr-FR]" },
  { value: "fr-CA", label: "French (Canada) [fr-CA]" },
  { value: "de-DE", label: "German (Germany) [de-DE]" },
  { value: "it-IT", label: "Italian (Italy) [it-IT]" },
  { value: "pt-BR", label: "Portuguese (Brazil) [pt-BR]" },
  { value: "pt-PT", label: "Portuguese (Portugal) [pt-PT]" },
  { value: "ru-RU", label: "Russian (Russia) [ru-RU]" },
  { value: "zh-CN", label: "Chinese (Simplified) [zh-CN]" },
  { value: "zh-TW", label: "Chinese (Traditional) [zh-TW]" },
  { value: "ja-JP", label: "Japanese (Japan) [ja-JP]" },
  { value: "ko-KR", label: "Korean (South Korea) [ko-KR]" },
]

interface MultiselectProps {
  selectedLanguages: string[]
  onLanguagesChange: (languages: string[]) => void
  placeholder?: string
  className?: string
}

export function Multiselect({
  selectedLanguages,
  onLanguagesChange,
  placeholder = "Select languages...",
  className
}: MultiselectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [recentlyUsedLanguages, setRecentlyUsedLanguages] = React.useState<string[]>([
    "en-US", "es-ES", "fr-FR" // Some default recent languages
  ])

  const addToRecentlyUsed = (languageValue: string) => {
    setRecentlyUsedLanguages(prev => {
      const filtered = prev.filter(lang => lang !== languageValue)
      return [languageValue, ...filtered].slice(0, 5) // Keep only 5 recent languages
    })
  }


  const getDisplayText = (selectedLangs: string[]) => {
    if (selectedLangs.length === 0) {
      return placeholder
    }
    
    const languageNames = selectedLangs.map(value => 
      languages.find(lang => lang.value === value)?.label
    ).filter(Boolean)
    
    // Estimate character space (based on button width, accounting for chevron icon)
    const maxChars = 80
    const countText = ` ...${selectedLangs.length} languages selected`
    let currentText = ""
    
    for (let i = 0; i < languageNames.length; i++) {
      const nextLanguage = languageNames[i]
      const separator = i > 0 ? ", " : ""
      const testText = currentText + separator + nextLanguage
      
      // If adding this language would exceed space and there are more languages
      if (testText.length + countText.length > maxChars && i < languageNames.length - 1) {
        return currentText + countText
      }
      
      currentText = testText
    }
    
    return currentText
  }

  const handleLanguageToggle = (languageValue: string) => {
    const newSelection = selectedLanguages.includes(languageValue)
      ? selectedLanguages.filter(lang => lang !== languageValue)
      : [...selectedLanguages, languageValue]
    
    onLanguagesChange(newSelection)
    if (!selectedLanguages.includes(languageValue)) {
      addToRecentlyUsed(languageValue)
    }
  }

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) setSearchValue("") // Clear search when closing
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {getDisplayText(selectedLanguages)}
          <div className="flex items-center gap-1">
            {selectedLanguages.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onLanguagesChange([])
                }}
                className="rounded-sm p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-3 w-3 opacity-50 hover:opacity-100" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" style={{width: 'var(--radix-popover-trigger-width)'}}>
        <Command>
          <CommandInput 
            placeholder="Search language..." 
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            {selectedLanguages.length > 0 && (
              <CommandGroup heading="Selected Languages">
                {selectedLanguages.map((languageValue) => {
                  const language = languages.find(lang => lang.value === languageValue)
                  return language ? (
                    <CommandItem
                      key={language.value}
                      value={language.value}
                      onSelect={() => handleLanguageToggle(language.value)}
                    >
                      {language.label}
                      <Check className="ml-auto h-4 w-4 opacity-100" />
                    </CommandItem>
                  ) : null
                })}
              </CommandGroup>
            )}
            
            {recentlyUsedLanguages.filter(lang => !selectedLanguages.includes(lang)).length > 0 && (
              <CommandGroup heading="Recently Used">
                {recentlyUsedLanguages
                  .filter(lang => !selectedLanguages.includes(lang))
                  .map((languageValue) => {
                    const language = languages.find(lang => lang.value === languageValue)
                    return language ? (
                      <CommandItem
                        key={language.value}
                        value={language.value}
                        onSelect={() => handleLanguageToggle(language.value)}
                      >
                        {language.label}
                        <Check className="ml-auto h-4 w-4 opacity-0" />
                      </CommandItem>
                    ) : null
                  })}
              </CommandGroup>
            )}
            
            <CommandGroup heading="Other Languages">
              {languages
                .filter(language => 
                  !selectedLanguages.includes(language.value) && 
                  !recentlyUsedLanguages.includes(language.value)
                )
                .map((language) => (
                  <CommandItem
                    key={language.value}
                    value={language.value}
                    onSelect={() => handleLanguageToggle(language.value)}
                  >
                    {language.label}
                    <Check className="ml-auto h-4 w-4 opacity-0" />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}