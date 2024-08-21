'use client'
import {SignedIn, SignedOut, UserButton, useUser} from '@clerk/nextjs'
import {useEffect, useState} from 'react'

import {collection, doc, getDoc, getDocs} from 'firebase/firestore'
import {db} from '/firebase'

import {useSearchParams} from 'next/navigation'

import SvgIcon from '@mui/material/SvgIcon';
import AddIcon from '@mui/icons-material/Add';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

import {
    AppBar,
    Toolbar,
    Container,
    Typography, 
    Button, 
    Grid,
    Box,
    TextField,
    Paper,
    CardActionArea,
    CardContent,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    DialogTitle
    } from '@mui/material'

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db,'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach((doc) => {
                flashcards.push({id: doc.id, ...doc.data()})
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container
            maxWidth='100vw'>
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

      <Box
      sx={{mt:12, mb:3}}
      width='100vw'
      textAlign='center'>
          <Typography
                variant="h4"
                style={{fontFamily: 'Moderustic, sans-serif'}}>
            {search}
            </Typography>
            </Box>
            <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <CardActionArea
                                    onClick={() => {
                                        handleCardClick(index)
                                    }}
                                    >
                                    <CardContent>
                                    <Box
                                        sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '300px',
                                                boxShadow: '0 4px 0px 0 rgba(0,0,0,0.2)',
                                                transform: flipped[index]
                                                    ? 'rotateY(180deg)'
                                                    : 'rotateY(0deg)',
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}>
                                        <div>
                                            <div>
                                               <Typography variant="h5" sx={{fontFamily: 'IBM Plex Sans, sans-serif'}} component="div">
                                                {flashcard.front}
                                                </Typography> 
                                            </div>
                                            <div>
                                               <Typography variant="h6" sx={{fontSize:'16px',fontFamily: 'IBM Plex Sans, sans-serif'}} component="div">
                                                {flashcard.back}
                                                </Typography> 
                                            </div>
                                        </div>
                                    </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Grid>
                        ))}
            </Grid>
        </Container>
    )
}