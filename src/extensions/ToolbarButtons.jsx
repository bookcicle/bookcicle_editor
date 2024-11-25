import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

export const ToolbarButton = ({ Icon, tooltip, isActive, ...rest }) => {
    const sx = isActive
        ? {
            width: '30px',
            height: '30px',
            marginRight: '4px',
            color: '#2f80ed',
            borderRadius: '4px',
            backgroundColor: 'rgba(47, 128, 237, 0.2)',
            ':hover': {
                backgroundColor: 'rgba(47, 128, 237, 0.3)',
            },
        }
        : {
            color: '#444',
            width: '30px',
            height: '30px',
            marginRight: '4px',
            borderRadius: '4px',
            ':hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.035)',
            },
        };

    return (
        <Tooltip title={tooltip}>
      <span>
        <IconButton
            {...rest}
            color="inherit"
            size="small"
            disableRipple
            sx={sx}
        >
          <Icon />
        </IconButton>
      </span>
        </Tooltip>
    );
};
