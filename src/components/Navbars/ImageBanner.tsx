import BannerImage from '../../assets/banner-photox1200.jpg';
import { CardActionArea, CardMedia, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
const StyledCardMedia = styled(CardMedia)(() => ({
    //margin: '-70px auto 0',
    width: '100%',
    height: 400,
    borderRadius: '4px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    position: 'relative',
    zIndex: 1000,
    objectFit: 'cover',
}));

function ImageBanner() {
    return (
        <Card>
            <CardActionArea>
                <StyledCardMedia image={BannerImage}></StyledCardMedia>
            </CardActionArea>
        </Card>
    );
}

export default ImageBanner;
