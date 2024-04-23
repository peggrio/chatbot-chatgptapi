# script.py
import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import clip
from transformers import CLIPTextModel, CLIPTokenizer
from diffusers import AutoencoderKL, UNet2DConditionModel, UniPCMultistepScheduler
from tqdm.auto import tqdm
from PIL import Image

# solve python certification issue
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    # Legacy Python that doesn't verify HTTPS certificates by default
    pass
else:
    # Handle target environment that doesn't support HTTPS verification
    ssl._create_default_https_context = _create_unverified_https_context

def generate_image(prompt, uuid):
    # Config
    prompt = [prompt]
    height = 512  # default height of Stable Diffusion
    width = 512  # default width of Stable Diffusion
    num_inference_steps = 25  # Number of denoising steps
    guidance_scale = 7.5  # Scale for classifier-free guidance
    generator = torch.manual_seed(0)  # Seed generator to create the initial latent noise
    batch_size = len(prompt)
    device = "cpu"

    # Load pre-trained models
    tokenizer = CLIPTokenizer.from_pretrained("CompVis/stable-diffusion-v1-4", subfolder="tokenizer")
    text_encoder = CLIPTextModel.from_pretrained("CompVis/stable-diffusion-v1-4", subfolder="text_encoder", use_safetensors=True)
    clipModel, clipPreprocess = clip.load("ViT-B/32", device=device, jit=False)
    
    scheduler = UniPCMultistepScheduler.from_pretrained("CompVis/stable-diffusion-v1-4", subfolder="scheduler")
    # unet = UNet2DConditionModel.from_pretrained("runwayml/stable-diffusion-v1-5", subfolder="unet", use_safetensors=True)
    unet = UNet2DConditionModel.from_pretrained("CompVis/stable-diffusion-v1-4", subfolder="unet", use_safetensors=True)
    vae = AutoencoderKL.from_pretrained("CompVis/stable-diffusion-v1-4", subfolder="vae", use_safetensors=True)

    # Tokenize the text and generate the embeddings from the prompt
    text_input = tokenizer(prompt, padding="max_length", max_length=tokenizer.model_max_length, truncation=True, return_tensors="pt")
    with torch.no_grad():
        text_embeddings = text_encoder(text_input.input_ids)[0]
    
    # Unconditional text embeddings
    max_length = text_input.input_ids.shape[-1]
    uncond_input = tokenizer([""] * batch_size, padding="max_length", max_length=max_length, return_tensors="pt")
    uncond_embeddings = text_encoder(uncond_input.input_ids)[0]
    
    # Concatenate
    text_embeddings = torch.cat([uncond_embeddings, text_embeddings])

    # Random image noise
    latents = torch.randn(
        (batch_size, unet.config.in_channels, height // 8, width // 8),
        generator=generator
    )

    # Denoise the image
    latents = latents * scheduler.init_noise_sigma
    
    scheduler.set_timesteps(num_inference_steps)
    
    for t in tqdm(scheduler.timesteps):
        latent_model_input = torch.cat([latents] * 2)
        latent_model_input = scheduler.scale_model_input(latent_model_input, timestep=t)
    
        # predict the noise residual
        with torch.no_grad():
            noise_pred = unet(latent_model_input, t, encoder_hidden_states=text_embeddings).sample
    
        # perform guidance
        noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)
        noise_pred = noise_pred_uncond + guidance_scale * (noise_pred_text - noise_pred_uncond)
    
        # compute the previous noisy sample x_t -> x_t-1
        latents = scheduler.step(noise_pred, t, latents).prev_sample

    # Use VAE to decode the image
    latents = 1 / 0.18215 * latents
    with torch.no_grad():
        image = vae.decode(latents).sample

    # Convert the image to a PIL
    image = (image / 2 + 0.5).clamp(0, 1).squeeze()
    image = (image.permute(1, 2, 0) * 255).to(torch.uint8).cpu().numpy()
    image = Image.fromarray(image)
    
    # Get the current directory of the script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create the 'testimage' folder if it doesn't exist
    output_dir = os.path.join(current_dir, 'testimage')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Save the image in the 'testimage' folder
    output_path = os.path.join(output_dir, f'{uuid}.png')

    image.save(output_path)

if __name__ == "__main__":
    import sys
    prompt = sys.argv[1]
    uuid = sys.argv[2]
    # prompt = "eczema at the back of the neck area on a white skin"
    generate_image(prompt, uuid)
    print('Image generated successfully')