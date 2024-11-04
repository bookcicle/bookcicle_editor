import ReactDOMServer from 'react-dom/server';
import Quill from 'quill';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import ListIcon from '@mui/icons-material/FormatListBulleted';
import LinkIcon from '@mui/icons-material/Link';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import ImageIcon from '@mui/icons-material/Image';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FunctionsIcon from '@mui/icons-material/Functions';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import SubscriptIcon from '@mui/icons-material/Subscript';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';

const icons = Quill.import('ui/icons');

const QuillIcons = () => {

    // Helper to wrap the MUI icon in a <i> tag and convert it to a string
    const renderIcon = (IconComponent, isFill = false) => {
        const svgIcon = ReactDOMServer.renderToStaticMarkup(<IconComponent />);
        return `<i class="custom-quill-icon ${isFill ? "bc-ql-fill" : ""}">${svgIcon}</i>`;
    };

    // Assign Material UI icons to Quill toolbar buttons
    icons['bold'] = renderIcon(FormatBoldIcon);
    icons['italic'] = renderIcon(FormatItalicIcon);
    icons['underline'] = renderIcon(FormatUnderlinedIcon);
    icons['strike'] = renderIcon(FormatStrikethroughIcon);
    icons['list'] = renderIcon(ListIcon);
    icons['link'] = renderIcon(LinkIcon);
    icons['clean'] = renderIcon(FormatClearIcon);

    icons['color'] = renderIcon(FormatColorTextIcon, true);
    icons['background'] = renderIcon(FormatColorFillIcon, true);

    icons['align'][''] = renderIcon(FormatAlignLeftIcon); // Default is left align
    icons['align']['center'] = renderIcon(FormatAlignCenterIcon);
    icons['align']['right'] = renderIcon(FormatAlignRightIcon);
    icons['align']['justify'] = renderIcon(FormatAlignJustifyIcon);

    icons['image'] = renderIcon(ImageIcon);
    icons['blockquote'] = renderIcon(FormatQuoteIcon);

    icons['indent']['-1'] = renderIcon(FormatIndentDecreaseIcon); // Tab left (decrease indent)
    icons['indent']['+1'] = renderIcon(FormatIndentIncreaseIcon); // Tab right (increase indent)

    icons['formula'] = renderIcon(FunctionsIcon);  // Formula (function fx)
    icons['script']['sub'] = renderIcon(SubscriptIcon);  // Subscript
    icons['script']['super'] = renderIcon(SuperscriptIcon);  // Superscript

    return null; // This component doesn't need to render anything itself
};

export default QuillIcons;
