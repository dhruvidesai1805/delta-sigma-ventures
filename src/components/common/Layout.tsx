import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" color="default" sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }} elevation={0}>
                <Toolbar>
                    <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
                        <PeopleAltIcon color="primary" />
                        <Typography variant="h6" component="div" sx={{ color: '#0f172a', fontWeight: 700 }}>
                            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                                UserDirectory
                            </Link>
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
                {children}
            </Container>
            <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} UserDirectory.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};
