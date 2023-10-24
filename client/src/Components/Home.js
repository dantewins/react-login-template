import { Container, Typography, Grid } from "@mui/material";
import { styled } from '@mui/material/styles';

import useAuth from '../Hooks/useAuth';

const ResponsiveContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginTop: 25,
  },
  [theme.breakpoints.up('md')]: {
    marginTop: 30,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: 55,
  }
}));

const Home = () => {
  const { auth } = useAuth();

  return (
    <ResponsiveContainer maxWidth="xl">
      <Grid>
        <Grid item>
          <Typography variant="h3">Speed is here, <b>{auth.username}</b></Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" mt={3}>What is speed?</Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle2" mt={1}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut eu sem integer vitae justo eget magna.
            A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Iaculis eu non diam phasellus vestibulum lorem sed. Cursus in hac habitasse platea. Facilisi etiam dignissim diam quis enim lobortis scelerisque. Velit aliquet sagittis id consectetur purus. Libero justo laoreet sit amet cursus. Magna ac placerat vestibulum lectus mauris. At imperdiet dui accumsan sit. Faucibus nisl tincidunt eget nullam non nisi. Facilisis gravida neque convallis a cras semper auctor neque. Ornare aenean euismod elementum nisi quis eleifend. Ac felis donec et odio pellentesque diam volutpat commodo sed. Senectus et netus et malesuada fames. Augue neque gravida in fermentum et sollicitudin ac. Vitae elementum curabitur vitae nunc sed velit. Nisi scelerisque eu ultrices vitae auctor eu augue ut. Faucibus turpis in eu mi. Vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean. Curabitur gravida arcu ac tortor dignissim convallis. Pharetra vel turpis nunc eget lorem dolor sed.
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" mt={3}>Why speed?</Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle2" mt={1}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut eu sem integer vitae justo eget magna.
            A iaculis at erat pellentesque adipiscing commodo elit at imperdiet. Iaculis eu non diam phasellus vestibulum lorem sed. Cursus in hac habitasse platea. Facilisi etiam dignissim diam quis enim lobortis scelerisque. Velit aliquet sagittis id consectetur purus. Libero justo laoreet sit amet cursus. Magna ac placerat vestibulum lectus mauris. At imperdiet dui accumsan sit. Faucibus nisl tincidunt eget nullam non nisi.
          </Typography>
        </Grid>
      </Grid>
    </ResponsiveContainer>
  )
}

export default Home;