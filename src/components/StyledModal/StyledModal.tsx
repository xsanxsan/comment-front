import StyledButton from "../StyledButton/StyledButton";
import styles from './modal.module.css';
import Modal from 'react-modal';

interface Props {
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

export default function StyledModal(props: Props) {
    const handleClickConfirm = () => {
        console.log("Clicked confirm");
        props.onConfirm()
    }

    const handleClickCancel = () => {
        console.log("Clicked cancel")
        props.onCancel()
    }

    return (
        <Modal
            isOpen={props.isOpen}
            style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-40%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '8px'
                  },
                  overlay: {
                    backgroundColor: 'rgba(0,0,0,.5)'
                  }
            }}
        >
        <div className={styles.modalWrapper}>
            <h1>Delete comment</h1>
            <p>Are you sure you want to delete this comment ? This will remove the comment and can't be undone.</p>
            <div className={styles.footer}>
                <StyledButton onClick={handleClickCancel} isCancelButton={true} label={'NO, CANCEL'}/>
                <StyledButton onClick={handleClickConfirm} label={'YES, DELETE'}/>
            </div>
        </div>
        </Modal>
    )
}