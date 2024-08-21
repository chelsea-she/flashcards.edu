'use client'
import {SignedIn, SignedOut, UserButton, useUser} from '@clerk/nextjs'
import {useRouter} from 'next/navigation'
import {db} from '/firebase'
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
import Divider from '@mui/material/Divider';
import { useState } from 'react'
import {doc, getDoc, collection, setDoc, writeBatch} from 'firebase/firestore'
import SvgIcon from '@mui/material/SvgIcon';
import AddIcon from '@mui/icons-material/Add';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}
export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert("Please enter a name")
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db,'users'),user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists()) {
            const collections  = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists.")
                return
            }
            else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    return (
        <Container
            sx={{ mt: 4, ml: 0, mr: 0 }}
    style={{ margin: 0, padding: 0 }}
        >
            
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
        <Box  
    width='100vw'
    display='flex'
    flexDirection='column'
    alignItems='center'
    justifyContent='center'>
            <Box
                sx={{
                    mt:4,
                    mb:6,
                    my:12,
                    display:"flex",
                    flexDirection:'column',
                    alignItems:'center',
                    width: '60%',
                    height: '200px'
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontFamily: 'Moderustic, sans-serif',
                            textAlign:'center'
                        }}>
                            Generate Flashcards
                    </Typography>
                    <Paper
                        sx={{p:4, width:'100%'}}>
                        <TextField 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            label = "Enter text"
                            fullWidth
                            multiline
                            rows={4}
                            variant='outlined'
                            sx={{
                                mb:2,
                                fontFamily: 'IBM Plex Sans, sans-serif'
                            }}>
                        </TextField>

                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleSubmit}
                            fullWidth
                            sx={{fontFamily: 'Moderustic, sans-serif'}}>
                                {' '}
                                Submit
                        </Button>
                    </Paper>
                    
            </Box>

            

            {flashcards.length > 0 && (
                <Box sx={{mt: 4, width: '100%'}}>
                    <Divider sx={{mb:4}}/>
                    <Typography variant="h5" sx={{fontFamily: 'Moderustic, sans-serif', textAlign: 'center', mb:'12px'}}>Flashcards Preview</Typography>
                    <Container>
                    <Grid container spacing={3} sx={{ width: '100%' }}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <CardActionArea
                                    onClick={() => {
                                        handleCardClick(index)
                                    }}>
                                    <CardContent>
                                    <Box
                                        sx={{
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '250px',
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
                                               <Typography variant="h7" component="div" sx={{fontSize:'16px',fontFamily: 'IBM Plex Sans, sans-serif'}}>
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
                    
                    <Box
                        sx={{mt:4, display: 'flex', justifyContent:'center'}}>
                        <Button variant='contained' color='secondary' onClick={handleOpen}
                            sx={{
                              backgroundColor:'#284B63',
                              fontFamily: 'Moderustic, sans-serif',
                              mb: '12px',
                              '&:hover': {
                              backgroundColor: '#3C6E71', // Custom hover background color
                            }}}>
                            Save
                        </Button>

                    </Box>
                </Box>
            )}
            
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Save Flashcards
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard collections
                    </DialogContentText>

                    <TextField 
                        autoFocus 
                        margin="dense" 
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"/>
                </DialogContent>

                <DialogActions
                    style={{fontFamily: 'Moderustic, sans-serif'}}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
            </Box>
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