// CustomIconButton.js
import React from 'react';
import IconButton from '@mui/material/IconButton';

/**
 * A generic IconButton with customized borderRadius on hover.
 *
 * @param {object} props - Props passed to the IconButton.
 * @param {React.ReactNode} props.children - The icon or content inside the IconButton.
 * @returns {JSX.Element} The customized IconButton component.
 */
const CustomIconButton = React.forwardRef(function CustomIconButton(props, ref) {
    const { children, sx, ...other } = props;

    return (
        <IconButton
            ref={ref}
            sx={{
                borderRadius: '8px', // Default borderRadius
                transition: 'border-radius 0.3s', // Smooth transition
                '&:hover': {
                    borderRadius: '4px', // Hover borderRadius
                },
                ...sx, // Allow overriding or extending styles via props
            }}
            {...other}
        >
            {children}
        </IconButton>
    );
});

export default CustomIconButton;
