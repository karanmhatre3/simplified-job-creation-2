import React from 'react'
import { HomeIcon, Languages, Bot, PlusIcon, Plug, SlidersHorizontal, Building2, File, Check, ChevronsUpDown, Trash2, Star, FileText, FileAudio } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Multiselect } from '@/components/Multiselect'
import { Switch } from '@/components/ui/switch'

const items = [
  {
    title: "Home",
    url: "#",
    icon: HomeIcon,
  },
  {
    title: "Translate",
    url: "#",
    icon: Languages,
  },
  {
    title: "Assistant",
    url: "#",
    icon: Bot,
  },
  {
    title: "Create",
    url: "#",
    icon: PlusIcon,
  },
  {
    title: "Connect",
    url: "#",
    icon: Plug,
  },
  {
    title: "Manage",
    url: "#",
    icon: SlidersHorizontal,
  },
]

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

const voices = [
  { value: "male-professional", label: "Male Professional" },
  { value: "female-professional", label: "Female Professional" },
  { value: "male-casual", label: "Male Casual" },
  { value: "female-casual", label: "Female Casual" },
  { value: "male-narrator", label: "Male Narrator" },
  { value: "female-narrator", label: "Female Narrator" },
  { value: "child-voice", label: "Child Voice" },
  { value: "elderly-male", label: "Elderly Male" },
  { value: "elderly-female", label: "Elderly Female" },
]

const translationModels = [
  { value: "standard", label: "Standard Model" },
  { value: "neural", label: "Neural Model" },
  { value: "adaptive", label: "Adaptive Model" },
  { value: "domain-specific", label: "Domain-Specific Model" },
  { value: "custom", label: "Custom Model" },
]

function App() {
  const [sourceLanguageOpen, setSourceLanguageOpen] = React.useState(false)
  const [sourceLanguage, setSourceLanguage] = React.useState("")
  const [targetLanguages, setTargetLanguages] = React.useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])
  const [humanCertified, setHumanCertified] = React.useState(false)
  
  // Expert verification fields
  const [expertInstructions, setExpertInstructions] = React.useState("")
  const [billingCode, setBillingCode] = React.useState("")
  const [jobName, setJobName] = React.useState("")
  const [dueDateTime, setDueDateTime] = React.useState("")
  const [certificationType, setCertificationType] = React.useState("")
  const [dubbingEnabled, setDubbingEnabled] = React.useState(false)
  const [selectedVoice, setSelectedVoice] = React.useState("")
  
  // Advanced options
  const [languageModels, setLanguageModels] = React.useState<Record<string, string>>({})
  const [tempLanguageModels, setTempLanguageModels] = React.useState<Record<string, string>>({})
  const [icuSupport, setIcuSupport] = React.useState(false)
  const [formatFiles, setFormatFiles] = React.useState(false)
  const [quotationApproval, setQuotationApproval] = React.useState(false)
  const [modelsDialogOpen, setModelsDialogOpen] = React.useState(false)
  const [isCalculatingCost, setIsCalculatingCost] = React.useState(false)
  const [showCost, setShowCost] = React.useState(false)
  
  // Effect to trigger cost calculation when files are uploaded and languages selected
  React.useEffect(() => {
    if (uploadedFiles.length > 0 && targetLanguages.length > 0 && !showCost) {
      setIsCalculatingCost(true)
      setShowCost(false)
      
      const timer = setTimeout(() => {
        setIsCalculatingCost(false)
        setShowCost(true)
      }, 5000) // 5 seconds
      
      return () => clearTimeout(timer)
    } else if (uploadedFiles.length === 0 || targetLanguages.length === 0) {
      setIsCalculatingCost(false)
      setShowCost(false)
    }
  }, [uploadedFiles.length, targetLanguages.length, showCost])
  
  // Helper function to check if uploaded files contain video or audio
  const hasVideoOrAudioFiles = () => {
    return uploadedFiles.some(file => {
      const fileType = file.type.toLowerCase()
      return fileType.startsWith('video/') || fileType.startsWith('audio/')
    })
  }
  
  // Helper function to sanitize filename for job name
  const sanitizeFilename = (filename: string) => {
    // Remove file extension
    const nameWithoutExtension = filename.replace(/\.[^/.]+$/, '')
    // Replace special characters with spaces and clean up multiple spaces
    return nameWithoutExtension
      .replace(/[._-]+/g, ' ') // Replace dots, underscores, dashes with spaces
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove other special characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim() // Remove leading/trailing spaces
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      setUploadedFiles(fileArray)
      
      // Auto-populate job name with sanitized first file name if job name is empty
      if (fileArray.length > 0 && !jobName.trim()) {
        const sanitizedName = sanitizeFilename(fileArray[0].name)
        if (sanitizedName) {
          setJobName(sanitizedName)
        }
      }
    }
  }
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleModelChange = (languageCode: string, modelValue: string) => {
    setLanguageModels(prev => ({
      ...prev,
      [languageCode]: modelValue
    }))
  }

  const handleTempModelChange = (languageCode: string, modelValue: string) => {
    setTempLanguageModels(prev => ({
      ...prev,
      [languageCode]: modelValue
    }))
  }

  const handleOpenModelsDialog = () => {
    setTempLanguageModels(languageModels)
    setModelsDialogOpen(true)
  }

  const handleSaveModels = () => {
    setLanguageModels(tempLanguageModels)
    setModelsDialogOpen(false)
  }

  const handleCancelModels = () => {
    setTempLanguageModels({})
    setModelsDialogOpen(false)
  }

  const handleSubmit = () => {
    console.log('Form submitted with:', {
      uploadedFiles,
      sourceLanguage,
      targetLanguages,
      languageModels,
      dubbingEnabled,
      selectedVoice,
      humanCertified,
      jobName,
      dueDateTime,
      expertInstructions,
      billingCode,
      certificationType,
      icuSupport,
      formatFiles,
      quotationApproval
    })
  }
  
  return (
    <SidebarProvider>
      {/* Left Sidebar - Navigation */}
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M16 20C13.7908 20 12 18.2092 12 16C12 13.791 13.7908 12 16 12C18.2092 12 20 13.791 20 16C20 18.2092 18.2092 20 16 20Z" fill="#071B5A"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M32 27H6C5.44775 27 5 26.5522 5 26V8H0V27C0 29.7615 2.2385 32 5 32H27C29.7615 32 32 29.7615 32 27Z" fill="#071B5A"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M27 24H32V5C32 2.2385 29.7615 0 27 0H5C2.2385 0 0 2.2385 0 5H26C26.5522 5 27 5.44775 27 6V24Z" fill="#3529BE"></path>
                    </svg>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">LILT</span>
                    <span className="truncate text-xs">Translation Platform</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Right Sidebar - Quotation */}
      {humanCertified && (
        <Sidebar side="right" collapsible="none" className="order-last border-l fixed right-0 top-0 h-screen z-10 w-64">
          <SidebarContent className="flex-1 h-full">
            <SidebarGroup className="flex-1 h-full">
              <SidebarGroupContent className="flex flex-col h-full min-h-0">
                {uploadedFiles.length > 0 && targetLanguages.length > 0 ? (
                  <div className="flex flex-col gap-3 px-2">
                    <h3 className="text-lg font-semibold mb-1 pt-6">Translation Quotation</h3>
                    {/* Quotation Details */}
                    <div className="flex flex-col gap-2 pb-3 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Number of files</span>
                        <span className="font-medium">{uploadedFiles.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Number of words</span>
                        <span className="font-medium">1,203</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total language pairs</span>
                        <span className="font-medium">{targetLanguages.length}</span>
                      </div>
                    </div>

                    {dubbingEnabled && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Voice dubbing</span>
                        <span>$125.00</span>
                      </div>
                    )}
                    
                    {certificationType && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {certificationType === 'standard' && 'Standard certification'}
                          {certificationType === 'premium' && 'Premium certification'}
                          {certificationType === 'enterprise' && 'Enterprise certification'}
                        </span>
                        <span>
                          {certificationType === 'standard' && '$25.00'}
                          {certificationType === 'premium' && '$50.00'}
                          {certificationType === 'enterprise' && '$100.00'}
                        </span>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <div className="flex justify-between font-semibold">
                        <span>Estimated cost</span>
                        <span>
                          {isCalculatingCost ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                              <span className="text-sm">Calculating...</span>
                            </div>
                          ) : showCost ? (
                            `$${(() => {
                              let total = 225; // Base + Human certification
                              if (dubbingEnabled) total += 125; // Voice dubbing
                              if (certificationType === 'standard') total += 25;
                              if (certificationType === 'premium') total += 50;
                              if (certificationType === 'enterprise') total += 100;
                              return total.toFixed(2);
                            })()}`
                          ) : null}
                        </span>
                      </div>
                      {showCost && (
                        <div className="text-xs text-muted-foreground mt-2">
                          <p>Final price may vary based on content complexity</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="bg-muted/30 border border-border rounded-lg p-4 text-center text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Translation quote will be shown here once files are uploaded and languages are selected.</p>
                    </div>
                  </div>
                )}
                
                <div className="px-2 mb-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="advanced">
                      <AccordionTrigger className="text-sm font-medium">
                        Advanced Options
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="icu-support"
                              checked={icuSupport}
                              onCheckedChange={setIcuSupport}
                            />
                            <Label htmlFor="icu-support" className="text-sm font-medium">
                              Enable ICU support
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="format-files"
                              checked={formatFiles}
                              onCheckedChange={setFormatFiles}
                            />
                            <Label htmlFor="format-files" className="text-sm font-medium">
                              Format my files before delivery
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="quotation-approval"
                              checked={quotationApproval}
                              onCheckedChange={setQuotationApproval}
                            />
                            <Label htmlFor="quotation-approval" className="text-sm font-medium">
                              Quotation approval required
                            </Label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-semibold">LILT Translation</h1>
          </div>
        </header>
        <div className={`flex flex-1 flex-col items-center justify-center p-4 ${humanCertified ? 'pr-8' : ''}`}>
          <div className="w-full max-w-2xl flex flex-col gap-4">
            <Card>
              <CardContent className="flex flex-col gap-4">
                {uploadedFiles.length === 0 ? (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <File className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <div className="flex gap-2 flex-wrap justify-center">
                          <Badge variant="secondary">Text</Badge>
                          <Badge variant="secondary">PDF</Badge>
                          <Badge variant="secondary">Image</Badge>
                          <Badge variant="secondary">Video</Badge>
                          <Badge variant="secondary">Audio</Badge>
                        </div>
                      </div>
                      <input 
                        id="file-upload" 
                        type="file" 
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".txt,.pdf,.docx,.png,.jpg,.jpeg,.mp4,.mp3,.wav"
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Uploaded Files ({uploadedFiles.length})</h3>
                      <label htmlFor="file-upload-more">
                        <Button variant="outline" size="sm" asChild>
                          <span className="cursor-pointer">Add More Files</span>
                        </Button>
                        <input 
                          id="file-upload-more" 
                          type="file" 
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".txt,.pdf,.docx,.png,.jpg,.jpeg,.mp4,.mp3,.wav"
                        />
                      </label>
                    </div>
                    <div className="border rounded-lg">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className={`flex items-center justify-between px-3 py-2 ${
                            index !== uploadedFiles.length - 1 ? 'border-b' : ''
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {file.name} <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'})</span>
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="ml-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-language" className="gap-0">Source Language<span className="text-red-500">*</span></Label>
                  <Popover open={sourceLanguageOpen} onOpenChange={setSourceLanguageOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={sourceLanguageOpen}
                        className="w-full justify-between"
                      >
                        {sourceLanguage
                          ? languages.find((language) => language.value === sourceLanguage)?.label
                          : "Select source language..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start" style={{width: 'var(--radix-popover-trigger-width)'}}>
                      <Command>
                        <CommandInput placeholder="Search language..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                key={language.value}
                                value={language.value}
                                onSelect={(currentValue) => {
                                  setSourceLanguage(currentValue === sourceLanguage ? "" : currentValue)
                                  setSourceLanguageOpen(false)
                                }}
                              >
                                {language.label}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    sourceLanguage === language.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="target-languages" className="gap-0">Target Languages<span className="text-red-500">*</span></Label>
                    {targetLanguages.length > 0 && (
                      <Dialog open={modelsDialogOpen} onOpenChange={setModelsDialogOpen}>
                        <DialogTrigger asChild>
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={handleOpenModelsDialog}
                          >
                            Customize models (Advanced)
                          </button>
                        </DialogTrigger>
                      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Select Translation Models</DialogTitle>
                          <DialogDescription>
                            Choose specific translation models for each target language.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                          {targetLanguages.map((languageCode) => {
                            const language = languages.find(lang => lang.value === languageCode)
                            if (!language) return null
                            
                            return (
                              <div key={languageCode} className="space-y-2">
                                <Label>
                                  Model for {language.label.split('[')[0].trim()}
                                </Label>
                                <Select 
                                  value={tempLanguageModels[languageCode] || ""} 
                                  onValueChange={(value) => handleTempModelChange(languageCode, value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Standard Model" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {translationModels.map((model) => (
                                      <SelectItem key={model.value} value={model.value}>
                                        {model.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )
                          })}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={handleCancelModels}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveModels}>
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    )}
                  </div>
                  <Multiselect
                    selectedLanguages={targetLanguages}
                    onLanguagesChange={setTargetLanguages}
                    placeholder="Select target languages..."
                  />
                </div>

                </div>
              </CardContent>
            </Card>
            
            {hasVideoOrAudioFiles() && (
              <Card>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="dubbing-enabled"
                        checked={dubbingEnabled}
                        onCheckedChange={setDubbingEnabled}
                      />
                      <Label htmlFor="dubbing-enabled" className="text-sm font-medium">
                        Receive the file translation with dubbing
                      </Label>
                    </div>
                    <Badge className="flex items-center gap-1 text-xs" style={{backgroundColor: '#E1DFF5', color: '#3529BE'}}>
                      <FileAudio className="h-3 w-3" />
                      For audio/video files
                    </Badge>
                  </div>
                  
                  {dubbingEnabled && (
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a voice..." />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.value} value={voice.value}>
                            {voice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="human-certified"
                    checked={humanCertified}
                    onCheckedChange={setHumanCertified}
                  />
                  <Label htmlFor="human-certified" className="text-sm font-medium">
                    Receive a human-certified translation.
                  </Label>
                </div>
              </CardContent>
            </Card>
            
            {humanCertified && (
              <>
                <Card>
                  <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="job-name">Job name</Label>
                        <Input
                          id="job-name"
                          placeholder="Enter job name..."
                          value={jobName}
                          onChange={(e) => setJobName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="due-date">Due date</Label>
                        <Input
                          type="date"
                          id="due-date"
                          value={dueDateTime}
                          onChange={(e) => setDueDateTime(e.target.value)}
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expert-instructions">Instructions for experts</Label>
                      <Textarea
                        id="expert-instructions"
                        placeholder="Provide specific instructions for the translation experts..."
                        value={expertInstructions}
                        onChange={(e) => setExpertInstructions(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billing-code" className="gap-0">Billing code<span className="text-red-500">*</span></Label>
                        <Input
                          id="billing-code"
                          placeholder="Enter billing code..."
                          value={billingCode}
                          onChange={(e) => setBillingCode(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="certification-type" className="gap-0">Type of certification<span className="text-red-500">*</span></Label>
                        <Select value={certificationType} onValueChange={setCertificationType}>
                          <SelectTrigger id="certification-type" className="w-full">
                            <SelectValue placeholder="Select certification type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Certification</SelectItem>
                            <SelectItem value="premium">Premium Certification</SelectItem>
                            <SelectItem value="enterprise">Enterprise Certification</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="px-8"
                onClick={handleSubmit}
              >
                {humanCertified ? "Send for translation" : "Translate"}
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App