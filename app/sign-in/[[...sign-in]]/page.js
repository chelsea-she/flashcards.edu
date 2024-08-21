import {
    AppBar,
    Container,
    Button,
    Toolbar,
    Typography,
    Box
} from '@mui/material';
import Link from 'next/link'
import {SignIn} from '@clerk/nextjs'

export default function SignUpPage() {
    return (
    <Container maxWidth="100vw">
        <AppBar
      sx={{
        backgroundColor:"#284B63"
      }}>
        <Toolbar>
        <Typography 
            variant="h6"
            display="flex"
            style={{flexGrow:1, fontFamily: 'Moderustic, sans-serif'}}>
                <Button href='/' style={{fontSize:'20px',textTransform: 'none', color:'white',fontFamily: 'Moderustic, sans-serif'}}>flashcard.edu</Button>
            
          </Typography>

            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign up</Button>
        </Toolbar>
      </AppBar>

        <Box
            maxWidth="100vw"
            minHeight="100vh"
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            gap={2}
            sx={{
              my:-3,
            }}>
            <Typography
                variant="h4"
                style={{fontFamily: 'Moderustic, sans-serif'}}>
                    Sign In
            </Typography>
            <SignIn 
                forceRedirectUrl="/flashcards"/>
        </Box>
    </Container>
    )
}