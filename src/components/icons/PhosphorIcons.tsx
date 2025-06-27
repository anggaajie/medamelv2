import React from 'react';
import {
  House,
  Briefcase,
  GraduationCap,
  UserCircle,
  FileText,
  PlusCircle,
  ShieldCheck,
  Users,
  ChartLine,
  Bell,
  MagnifyingGlass,
  Calendar,
  MapPin,
  CurrencyDollar,
  Clock,
  CheckCircle,
  XCircle,
  Warning,
  Info,
  Eye,
  EyeSlash,
  Envelope,
  Lock,
  GoogleLogo,
  ArrowRight,
  ArrowLeft,
  Trash,
  Pencil,
  Download,
  Upload,
  Share,
  Heart,
  Star,
  Bookmark,
  Gear,
  SignOut,
  List,
  X,
  CaretDown,
  CaretUp,
  CaretLeft,
  CaretRight,
  DotsThree,
  DotsThreeVertical,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSlash,
  Microphone,
  VideoCamera,
  Camera,
  Image,
  File,
  Folder,
  FolderOpen,
  Cloud,
  WifiX,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryEmpty,
  CellSignalFull,
  CellSignalNone,
  Phone,
  PhoneSlash,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  ChatCircle,
  ChatText,
  Notification,
  ThumbsUp,
  ThumbsDown,
  Hand,
  Handshake,
  Smiley,
  SmileySad,
  SmileyMeh,
  SmileyWink,
  SmileySticker,
  HeartBreak,
  Lightning,
  Fire,
  Leaf,
  Tree,
  Flower,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Umbrella,
  Snowflake,
  Rainbow,
  Tornado,
  Hurricane,
  Meteor,
  Planet,
  Rocket,
  Dna,
  Brain,
  Heartbeat,
  Pulse,
  ThermometerHot,
  ThermometerCold,
  FirstAid,
  Pill,
  Syringe,
  Stethoscope,
  Hospital,
  Ambulance,
  FireTruck,
  PoliceCar,
  Taxi,
  Bus,
  Train,
  Airplane,
  Car,
  Motorcycle,
  Bicycle,
  Keyboard,
  Scooter,
  Wheelchair,
  Baby,
  Student,
  Door,
  Engine,
  SignIn,
  UserPlus,
  FloppyDisk,
} from '@phosphor-icons/react';

// Icon wrapper component with consistent styling
interface IconProps {
  className?: string;
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  color?: string;
}

const IconWrapper: React.FC<IconProps & { children: React.ReactNode }> = ({ 
  className = '', 
  size = 24, 
  weight = 'regular',
  color,
  children 
}) => {
  const iconStyle = color ? { color } : {};
  
  return (
    <div className={className} style={iconStyle}>
      {React.cloneElement(children as React.ReactElement, { 
        size, 
        weight,
        style: iconStyle 
      } as React.HTMLAttributes<SVGElement> & { size: number; weight: string; })}
    </div>
  );
};

// Navigation Icons
export const HomeIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <House />
  </IconWrapper>
);

export const BriefcaseIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Briefcase />
  </IconWrapper>
);

export const AcademicCapIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <GraduationCap />
  </IconWrapper>
);

export const UserCircleIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <UserCircle />
  </IconWrapper>
);

export const DocumentTextIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <FileText />
  </IconWrapper>
);

export const PlusCircleIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <PlusCircle />
  </IconWrapper>
);

export const ShieldCheckIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ShieldCheck />
  </IconWrapper>
);

export const UsersIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Users />
  </IconWrapper>
);

export const ChartLineIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ChartLine />
  </IconWrapper>
);

export const BellIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Bell />
  </IconWrapper>
);

// Action Icons
export const SearchIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <MagnifyingGlass />
  </IconWrapper>
);

export const CalendarIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Calendar />
  </IconWrapper>
);

export const MapPinIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <MapPin />
  </IconWrapper>
);

export const DollarIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <CurrencyDollar />
  </IconWrapper>
);

export const ClockIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Clock />
  </IconWrapper>
);

// Status Icons
export const CheckCircleIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <CheckCircle />
  </IconWrapper>
);

export const XCircleIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <XCircle />
  </IconWrapper>
);

export const WarningIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Warning />
  </IconWrapper>
);

export const InfoIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Info />
  </IconWrapper>
);

// UI Icons
export const EyeIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Eye />
  </IconWrapper>
);

export const EyeSlashIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <EyeSlash />
  </IconWrapper>
);

export const EnvelopeIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Envelope />
  </IconWrapper>
);

export const LockIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Lock />
  </IconWrapper>
);

export const GoogleIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <GoogleLogo />
  </IconWrapper>
);

// Direction Icons
export const ArrowRightIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ArrowRight />
  </IconWrapper>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ArrowLeft />
  </IconWrapper>
);

// Action Icons
export const TrashIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Trash />
  </IconWrapper>
);

export const PencilIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Pencil />
  </IconWrapper>
);

export const DownloadIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Download />
  </IconWrapper>
);

export const FloppyDiskIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <FloppyDisk />
  </IconWrapper>
);

export const UploadIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Upload />
  </IconWrapper>
);

export const ShareIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Share />
  </IconWrapper>
);

export const HeartIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Heart />
  </IconWrapper>
);

export const StarIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Star />
  </IconWrapper>
);

export const BookmarkIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Bookmark />
  </IconWrapper>
);

export const SettingsIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Gear />
  </IconWrapper>
);

export const LogOutIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SignOut />
  </IconWrapper>
);

// Menu Icons
export const MenuIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <List />
  </IconWrapper>
);

export const XIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <X />
  </IconWrapper>
);

// Caret Icons
export const CaretDownIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <CaretDown />
  </IconWrapper>
);

export const CaretUpIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <CaretUp />
  </IconWrapper>
);

export const CaretLeftIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <CaretLeft />
  </IconWrapper>
);

export const CaretRightIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <CaretRight />
  </IconWrapper>
);

// More Icons
export const DotsThreeIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <DotsThree />
  </IconWrapper>
);

export const DotsThreeVerticalIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <DotsThreeVertical />
  </IconWrapper>
);

// Media Icons
export const PlayIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Play />
  </IconWrapper>
);

export const PauseIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Pause />
  </IconWrapper>
);

export const StopIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Stop />
  </IconWrapper>
);

export const SkipBackIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SkipBack />
  </IconWrapper>
);

export const SkipForwardIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SkipForward />
  </IconWrapper>
);

export const VolumeHighIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SpeakerHigh />
  </IconWrapper>
);

export const VolumeLowIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SpeakerLow />
  </IconWrapper>
);

export const VolumeMuteIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SpeakerSlash />
  </IconWrapper>
);

export const MicrophoneIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Microphone />
  </IconWrapper>
);

export const VideoCameraIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <VideoCamera />
  </IconWrapper>
);

export const CameraIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Camera />
  </IconWrapper>
);

export const ImageIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Image />
  </IconWrapper>
);

// File Icons
export const FileIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <File />
  </IconWrapper>
);

export const FolderIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Folder />
  </IconWrapper>
);

export const FolderOpenIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <FolderOpen />
  </IconWrapper>
);

export const CloudIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Cloud />
  </IconWrapper>
);

// Communication Icons
export const MessageCircleIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ChatCircle />
  </IconWrapper>
);

export const MessageSquareIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ChatCircle />
  </IconWrapper>
);

export const MessageTextIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ChatText />
  </IconWrapper>
);

export const ChatCircleIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ChatCircle />
  </IconWrapper>
);

export const ChatSquareIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ChatCircle />
  </IconWrapper>
);

export const ChatTextIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ChatText />
  </IconWrapper>
);

// Notification Icons
export const NotificationIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Notification />
  </IconWrapper>
);

export const NotificationSlashIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Notification />
  </IconWrapper>
);

// Interaction Icons
export const ThumbsUpIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ThumbsUp />
  </IconWrapper>
);

export const ThumbsDownIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <ThumbsDown />
  </IconWrapper>
);

export const HandIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Hand />
  </IconWrapper>
);

export const HandRaisedIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Hand />
  </IconWrapper>
);

export const HandshakeIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Handshake />
  </IconWrapper>
);

// Emoji Icons
export const SmileyIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Smiley />
  </IconWrapper>
);

export const SmileySadIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SmileySad />
  </IconWrapper>
);

export const SmileyMehIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SmileyMeh />
  </IconWrapper>
);

export const SmileyWinkIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SmileyWink />
  </IconWrapper>
);

export const SmileyStickerIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SmileySticker />
  </IconWrapper>
);

export const HeartBreakIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <HeartBreak />
  </IconWrapper>
);

// Specialized Icons for Statistics
export const LamaranIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Briefcase />
  </IconWrapper>
);

export const PelatihanIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <GraduationCap />
  </IconWrapper>
);

export const PsikometriIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Brain />
  </IconWrapper>
);

export const CVIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <FileText />
  </IconWrapper>
);

export const ProfilIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <UserCircle />
  </IconWrapper>
);

// Additional icons for authentication and theme
export const LogInIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <SignIn />
  </IconWrapper>
);

export const UserPlusIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <UserPlus />
  </IconWrapper>
);

export const SunIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Sun />
  </IconWrapper>
);

export const MoonIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <Moon />
  </IconWrapper>
);

// Export all icons for easy access
export default {
  // Navigation
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  UserCircleIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChartLineIcon,
  BellIcon,
  
  // Actions
  SearchIcon,
  CalendarIcon,
  MapPinIcon,
  DollarIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon,
  DownloadIcon,
  FloppyDiskIcon,
  UploadIcon,
  ShareIcon,
  
  // Status
  CheckCircleIcon,
  XCircleIcon,
  WarningIcon,
  InfoIcon,
  
  // UI
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockIcon,
  GoogleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  
  // Carets
  CaretDownIcon,
  CaretUpIcon,
  CaretLeftIcon,
  CaretRightIcon,
  
  // More
  DotsThreeIcon,
  DotsThreeVerticalIcon,
  
  // Media
  PlayIcon,
  PauseIcon,
  StopIcon,
  SkipBackIcon,
  SkipForwardIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMuteIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  CameraIcon,
  ImageIcon,
  
  // Files
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  CloudIcon,
  
  // Communication
  MessageCircleIcon,
  MessageSquareIcon,
  MessageTextIcon,
  ChatCircleIcon,
  ChatSquareIcon,
  ChatTextIcon,
  
  // Notifications
  NotificationIcon,
  NotificationSlashIcon,
  
  // Interaction
  ThumbsUpIcon,
  ThumbsDownIcon,
  HandIcon,
  HandRaisedIcon,
  HandshakeIcon,
  
  // Emojis
  SmileyIcon,
  SmileySadIcon,
  SmileyMehIcon,
  SmileyWinkIcon,
  SmileyStickerIcon,
  HeartBreakIcon,
  
  // Statistics
  LamaranIcon,
  PelatihanIcon,
  PsikometriIcon,
  CVIcon,
  ProfilIcon,
  
  // Additional icons for authentication and theme
  LogInIcon,
  UserPlusIcon,
  SunIcon,
  MoonIcon,
}; 