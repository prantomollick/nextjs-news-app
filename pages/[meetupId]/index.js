import { MongoClient, ObjectId } from 'mongodb';

import MeetupDetail from '../../components/meetups/MeetupDetail';

const MeetupDetails = (props) => {
    console.log(props);
  return (
    <MeetupDetail
      image={props.meetupData.image}
      title={props.meetupData.title}
      address={props.meetupData.address}
      description={props.meetupData.description}
    />
  );
};


export async function getStaticPaths() {
    const client = await MongoClient.connect('mongodb+srv://pranto:1y1lYALHhbGFI5ry@cluster0.q0s4p.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();
    client.close();
    return {
        fallback: false,
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString()}}))
    }
};

export async function getStaticProps(context) {
    //fetch data for a single meetup
    const meetupId = context.params.meetupId;
    console.log(meetupId);
    const client = await MongoClient.connect('mongodb+srv://pranto:1y1lYALHhbGFI5ry@cluster0.q0s4p.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });
    console.log(selectedMeetup);
    client.close();
    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                image: selectedMeetup.image,
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            }, 
        },
    } 
};


export default MeetupDetails;
