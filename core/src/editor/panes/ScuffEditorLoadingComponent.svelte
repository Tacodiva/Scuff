<div class="scuff-loading">
    <div />
</div>

<style>
    .scuff-loading {
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .scuff-loading > div {
        width: min(50px, 5%);
        aspect-ratio: 1/1;
        border-radius: 50%;
        border: 15px solid transparent;
        border-top-color: #07d;
        border-bottom-color: #07d;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
