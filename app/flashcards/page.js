'use client'
import {SignedIn, SignedOut, UserButton, useUser} from '@clerk/nextjs'
import {useEffect, useState} from 'react'

import {collection, doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '/firebase'
import { useRouter } from 'next/navigation'
import {
    AppBar,
    Toolbar,
    Container,
    Typography, 
    Button, 
    Grid,
    CardActionArea,
    CardContent,
    Card,
    Box
    } from '@mui/material'
import SvgIcon from '@mui/material/SvgIcon';
import AddIcon from '@mui/icons-material/Add';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

export default function Flashcards() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db,'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            }
            else {
                await setDoc(docRef,{flashcards: []})
            }
        }
        getFlashcards()
    }, [user])

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
<Container width="100vw"
    sx={{ mt: 4, ml: 0, mr: 0 }}
    style={{ margin: 0, padding: 0 }}>

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

          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign up</Button>
          </SignedOut>

          <SignedIn>
            <UserButton/>
          </SignedIn>

          <Button
            href='/flashcards'
            sx={{
                color: "white",
                minWidth: 0, 
                ml:'14px',
                '&:hover': {
              backgroundColor: '#3A6F92', // Custom hover background color
            }
              }}>
          <HomeIcon />
            </Button>

            <Button href="/generate"
                sx={{
                    color: "white",
                    minWidth: 0, // Remove default min-width to reduce spacing
                    ml: "6px", 
                    '&:hover': {
              backgroundColor: '#3A6F92', // Custom hover background color
            }
                  }}>
            <AddIcon />
              </Button>
        </Toolbar>
      </AppBar>

      {isSignedIn ? (
<Container>
      <Box
      sx={{
                    mt:12,
                    width:'100vw',
                    textAlign:'center'
                }}>
          <Typography
                variant="h5"
                py={2}
                style={{fontFamily: 'Moderustic, sans-serif'}}>
            Welcome, {user.username || user.firstName + " " + user.lastName || user.emailAddress}
            </Typography>
            </Box>

            <Typography variant="h4" sx={{fontFamily: 'Moderustic, sans-serif'}} px={2}>
                    Flashcards
            </Typography>

        <Container
        maxWidth={false} // This removes the default maxWidth constraint of the Container
        sx={{
            width: '100vw', // Full viewport height to center vertically
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0, // Remove default padding
        }}>
            <Grid container 
                spacing={3}
                sx={{mt:3, maxWidth: '100%', p: '0', margin:'0', ml:-9}}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card>
                            <CardActionArea
                                onClick={() => {
                                    handleCardClick(flashcard.name)
                                }}>
                                <CardContent>
                                    <Typography variant="h6">{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            </Container>
</Container>
        ) : (
            <Box
      sx={{
                    p:2,
                    mt:12,
                    display:"flex",
                    flexDirection:'column',
                    alignItems:'center'
                }}>
          <Typography
                variant="h5"
                p={2}
                style={{fontFamily: 'Moderustic, sans-serif'}}>
            Please sign in before creating flashcards. 
            </Typography>
            </Box>
        )}

        </Container>
    )
}