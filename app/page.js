'use client'
import Image from "next/image";
import getStripe from '@/utils/get-stripe';
import {SignedIn, SignedOut, UserButton, useUser} from '@clerk/nextjs'
import {useEffect, useState, useRef} from 'react'
import {
  Container, 
  AppBar, 
  Typography, 
  Button, 
  Toolbar,
  Box,
  Grid
  } from '@mui/material'
import Head from 'next/head'
import SvgIcon from '@mui/material/SvgIcon';

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

export default function Home() {
  const {isSignedIn, user} = useUser()

  const [isVisible, setIsVisible] = useState(false);

  const [isVisible2, setIsVisible2] = useState(false);
  const textRef = useRef();

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }

  useEffect(() => {
    setIsVisible(true);
    // Add an event listener to the button when the component is mounted
    const button = document.getElementById('scroll-button');
    button.addEventListener('click', () => {
      const element = document.getElementById('lower-box');
      element.scrollIntoView({ behavior: 'smooth' });
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible2(true);
          observer.unobserve(entry.target); // Stop observing after it becomes visible
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is in view
      }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    // Cleanup the event listener when the component is unmounted
    return () => {
      button.removeEventListener('click', () => {
        const element = document.getElementById('lower-box');
        element.scrollIntoView({ behavior: 'smooth' });
      });
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <Container 
      maxWidth="100vw"
      height="100vh"
      >
      <Head>
        <title>flashcard.edu</title> 
        <meta name="description" content="Create flashcard from you text"/>
      </Head>

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
            href='/flashcards'>
          <HomeIcon 
            sx={{
              color: 'white', // Custom text color,
              width: '50px',
            }}/>
            </Button>
        </Toolbar>
      </AppBar>

      <Box
        maxWidth="100vw"
        minHeight="90vh"
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        gap={2}
        sx={{
          my:-3,
        }}
        >
        <Typography
          variant="h3"
          color='#353535'
          fontWeight='500'
          sx={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            fontFamily: 'Moderustic, sans-serif'
          }}>
            welcome to flashcard.edu
        </Typography>
        <Typography
          variant="h5"
          color="#5C5C5C"
          sx={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            fontFamily: 'Moderustic, sans-serif'
          }}
        >
          the easiest way to create flashcards to study for any class.
        </Typography>
        <Box>
          <Button
            variant="contained"
            src={{mt:2}}
            sx={{
              backgroundColor:'#284B63',
              '&:hover': {
              backgroundColor: '#3C6E71', // Custom hover background color
            },
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 2s ease-in-out',
            fontFamily: 'Moderustic, sans-serif'
            }}
            id="scroll-button">
            Get Started
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          mb:6
        }}
        id="lower-box">
          <Typography
            variant="h4"
            py={2}
            sx={{
              fontFamily: 'Moderustic, sans-serif',
              textAlign: 'center'
            }}>
            Features
          </Typography>


          <Grid
            container
            width='100vw'
            textAlign='center'
            px='15%'>

              <Grid 
                item
                xs={4}
                md={4}
                p={3}
                bgcolor="#3B6F91"
                color="white"
                ref={textRef}
                className={isVisible2 ? 'fade-in' : 'hidden'}>
                  <Typography variant="h5"
                    sx={{fontFamily: 'IBM Plex Sans, sans-serif', mb: 2}}>
                    Smart Flashcards
                  </Typography>
                  <Typography variant="h6"
                    sx={{fontFamily: 'IBM Plex Sans, sans-serif'}}>
                    {' '}
                    Our AI intelligently breaks down you text into concise flashcards,
                    perfect for studying. 
                  </Typography>
                </Grid>

                <Grid 
                item
                xs={4}
                md={4}
                p={3}
                bgcolor="#2F5874"
                color="white"
                ref={textRef}
                className={isVisible2 ? 'fade-in' : 'hidden'}>
                  <Typography variant="h5"
                  sx={{fontFamily: 'IBM Plex Sans, sans-serif', mb: 2}}>
                    Easy Text Input
                  </Typography>
                  <Typography variant="h6"
                    sx={{fontFamily: 'IBM Plex Sans, sans-serif'}}>
                    {' '}
                    Simply input your text and let our software do the rest.
                    Creating flashcards has never been easier.
                  </Typography>
                </Grid>

                <Grid 
                item
                xs={4}
                md={4}
                p={3}
                bgcolor="#234257"
                color="white"
                ref={textRef}
                className={isVisible2 ? 'fade-in' : 'hidden'}>
                  <Typography variant="h5" 
                    sx={{fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: '300', mb:2}}>
                    Accessible Anywhere
                  </Typography>
                  <Typography variant="h6" sx={{
                    fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: '300', }}>
                    {' '}
                    Access your flashcards from any device, at any time.
                    Study on the go in any situation.
                  </Typography>
                </Grid>
          </Grid>
      </Box>

      <Box
        sx={{mb:3}}>
      <Typography
            variant="h4"
            py={2}
            sx={{
              fontFamily: 'Moderustic, sans-serif',
              textAlign: 'center'
            }}>
            Pricing
        </Typography>
        <Grid
            container
            width='100vw'
            textAlign='center'
            px='15%'
            spacing={2}>
                <Grid 
                item
                xs={6}
                md={6}>
                  <Box
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor:'grey.300',
                      borderRadius:2,
                    }}>
                  <Typography 
                    variant="h5" sx={{
                      fontFamily: 'Moderustic, sans-serif', fontWeight:'500' }}
                    gutterBottom>
                    Basic
                  </Typography>
                  <Typography 
                    variant="h5"
                    sx={{
                      fontFamily: 'IBM Plex Sans, sans-serif', fontWeight:'500' }}
                    gutterBottom>
                    Free
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'IBM Plex Sans, sans-serif', fontWeight:'500' }}
                    gutterBottom>
                    {' '}
                    Access to all basic flashcard features and generation of 10 flashcards.
                  </Typography>

            {isSignedIn ? (
              <Button
              variant="contained"
              src={{mt:2}}
              href="/flashcards"
              sx={{
                backgroundColor:'#234257',
                color:'white',
                '&:hover': {
                backgroundColor: '#3A6F92', // Custom hover background color
              },
              }}>
              choose basic
            </Button>
            ) : (
              <Button
            variant="contained"
            src={{mt:2}}
            href="/sign-up"
            sx={{
              backgroundColor:'#234257',
              color:'white',
              '&:hover': {
              backgroundColor: '#3A6F92', // Custom hover background color
            },
            }}>
            choose basic
          </Button>
            )}
                  
                  </Box>
                </Grid>

                <Grid 
                item
                xs={6}
                md={6}>
                  <Box
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor:'grey.300',
                      borderRadius:2,
                    }}>
                  <Typography 
                    variant="h5" sx={{
                      fontFamily: 'Moderustic, sans-serif', fontWeight:'500' }}
                    gutterBottom>
                    Pro
                  </Typography>
                  <Typography 
                    variant="h5"
                    sx={{
                      fontFamily: 'IBM Plex Sans, sans-serif', fontWeight:'500' }}
                    gutterBottom>
                    $10 / month
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'IBM Plex Sans, sans-serif', fontWeight:'500' }}
                    gutterBottom>
                    {' '}
                    Unlimited flashcard generation, unlimited storage, and priority support.
                  </Typography>
                  <Button
                  onClick={handleSubmit}
            variant="contained"
            src={{mt:2}}
            sx={{
              backgroundColor:'#234257',
              color:'white',
              '&:hover': {
              backgroundColor: '#3A6F92', // Custom hover background color
            },
            fontFamily: 'Moderustic, sans-serif'
            }}>
            choose pro
          </Button>
                  </Box>
                </Grid>
          </Grid>
      </Box>


    </Container>
  )
}
