// ============================================================
//  GIOCATORE (PlayerController)
//  Muove il personaggio: WASD o levetta sinistra, mouse o levetta destra per guardare, Shift per correre, E per interagire.
//
//  DOVE SI METTE
//    Trascina PF_Kit_Giocatore_TerzaPersona o PF_Kit_Giocatore_PrimaPersona nella scena. Uno solo.
//
//  COSA CONFIGURARE (nell'Inspector)
//    First Person: spunta per la prima persona (il prefab PrimaPersona ce l'ha gia').
//    Walk Speed / Run Speed: velocita' a piedi e di corsa (metri al secondo).
//    Cam Distance e Cam Height: distanza e altezza della camera in terza persona.
//    Interact Range: da quanto lontano si usa un Interactable.
//    Step Clips: i suoni dei passi (trascinane quanti vuoi).
//
//  COME SI COLLEGA
//    Actions e Camera Transform sono gia' collegati nel prefab.
//
//  ESEMPIO
//    Sposta il prefab nel punto di partenza del livello e premi Play.
// ============================================================
using UnityEngine;
using UnityEngine.InputSystem;

/// <summary>
/// Giocatore in terza o prima persona. Legge le Input Actions del kit (Settings/Kit_InputActions):
/// WASD / levetta sinistra per muoversi, mouse / levetta destra per guardare, Shift / pressione della levetta
/// per correre, E / tasto A per interagire.
/// </summary>
[RequireComponent(typeof(CharacterController))]
public class PlayerController : MonoBehaviour
{
    [Tooltip("Asset delle Input Actions (Settings/Kit_InputActions)")] public InputActionAsset actions;
    [Tooltip("Spunta per la prima persona")] public bool firstPerson;
    [Tooltip("Animator del modello (puo' essere vuoto)")] public Animator animator;
    [Tooltip("La camera del giocatore (gia' collegata nel prefab)")] public Transform cameraTransform;
    [Tooltip("Velocita' a piedi (metri al secondo)")] public float walkSpeed = 1.6f;
    [Tooltip("Velocita' di corsa (metri al secondo)")] public float runSpeed = 4.5f;
    [Tooltip("Gravita' (negativa = verso il basso)")] public float gravity = -20f;
    [Tooltip("Sensibilita' del mouse")] public float mouseSens = 0.12f;
    [Tooltip("Sensibilita' della levetta del gamepad (gradi al secondo)")] public float gamepadSens = 120f;
    [Tooltip("Distanza della camera dietro al giocatore (terza persona)")] public float camDistance = 4.2f;
    [Tooltip("Altezza della camera (terza persona)")] public float camHeight = 1.7f;
    [Tooltip("Altezza degli occhi (prima persona)")] public float eyeHeight = 1.65f;
    [Tooltip("Da quanto lontano si usa un oggetto con E (metri)")] public float interactRange = 2.2f;
    [Tooltip("Suoni dei passi: trascina qui i file audio")] public AudioClip[] stepClips;
    public Interactable Current => current;

    /// <summary>Vero se il collider appartiene al giocatore. Usato dai componenti del kit.</summary>
    public static bool IsPlayer(Collider c) => c && c.GetComponentInParent<PlayerController>();

    CharacterController cc; float yaw, pitch = 15f, vy, stepTimer; Interactable current; bool interactPrev;
    InputActionMap playerMap; InputAction move, look, sprint, interact;

    void Awake()
    {
        if (!actions) { Debug.LogWarning("PlayerController senza Input Actions: assegna Settings/Kit_InputActions.", this); return; }
        playerMap = actions.FindActionMap("Player");
        move = actions.FindAction("Player/Move"); look = actions.FindAction("Player/Look");
        sprint = actions.FindAction("Player/Sprint"); interact = actions.FindAction("Player/Interact");
    }

    void OnEnable() { playerMap?.Enable(); }
    void OnDisable() { playerMap?.Disable(); }

    void Start()
    {
        cc = GetComponent<CharacterController>();
        yaw = transform.eulerAngles.y;
        Cursor.lockState = CursorLockMode.Locked; Cursor.visible = false;
    }

    void Update()
    {
        if (playerMap == null) return;

        // Con la scheda storica aperta il giocatore non si muove: E la richiude.
        if (InfoPoint.Current) { if (InteractEdge()) InfoPoint.Current.Close(); return; }
        if (Time.timeScale == 0f) return; // pausa

        var lookDelta = look.ReadValue<Vector2>();
        bool fromMouse = look.activeControl != null && look.activeControl.device is Pointer;
        var turn = fromMouse ? lookDelta * mouseSens : lookDelta * gamepadSens * Time.deltaTime;
        yaw += turn.x; pitch = Mathf.Clamp(pitch - turn.y, firstPerson ? -80f : -20f, firstPerson ? 80f : 60f);

        var mv = Vector2.ClampMagnitude(move.ReadValue<Vector2>(), 1f);
        float speed = sprint.IsPressed() ? runSpeed : walkSpeed;
        var fwd = Quaternion.Euler(0, yaw, 0) * Vector3.forward; var right = Quaternion.Euler(0, yaw, 0) * Vector3.right;
        var motion = (fwd * mv.y + right * mv.x) * speed;
        if (cc.isGrounded && vy < 0) vy = -2f; vy += gravity * Time.deltaTime;
        cc.Move((motion + Vector3.up * vy) * Time.deltaTime);

        if (motion.sqrMagnitude > 0.01f && !firstPerson) transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(motion), 12f * Time.deltaTime);
        else if (firstPerson) transform.rotation = Quaternion.Euler(0, yaw, 0);

        float planar = new Vector3(cc.velocity.x, 0, cc.velocity.z).magnitude;
        if (animator && animator.runtimeAnimatorController) animator.SetFloat("Speed", planar, 0.1f, Time.deltaTime);
        if (planar > 0.5f && cc.isGrounded) { stepTimer -= Time.deltaTime * (planar / 1.6f); if (stepTimer <= 0 && stepClips != null && stepClips.Length > 0) { KitAudio.Play(stepClips[Random.Range(0, stepClips.Length)], transform.position, 0.6f); stepTimer = 0.55f; } }

        UpdateInteract();
    }

    // Fronte di pressione calcolato a mano: WasPressedThisFrame non e' affidabile con il Play Mode fatto avanzare a passi.
    bool InteractEdge() { bool down = interact.IsPressed(); bool edge = down && !interactPrev; interactPrev = down; return edge; }

    /// <summary>Sposta il giocatore (checkpoint, trappole) senza farlo cadere o rimbalzare.</summary>
    public void Teleport(Vector3 position, Quaternion rotation)
    {
        var c = cc ? cc : GetComponent<CharacterController>();
        if (c) c.enabled = false;
        transform.SetPositionAndRotation(position, Quaternion.Euler(0, rotation.eulerAngles.y, 0));
        if (c) c.enabled = true;
        yaw = rotation.eulerAngles.y; vy = 0f;
    }

    void LateUpdate()
    {
        if (!cameraTransform) return;
        if (firstPerson) { cameraTransform.position = transform.position + Vector3.up * eyeHeight; cameraTransform.rotation = Quaternion.Euler(pitch, yaw, 0); }
        else
        {
            var rot = Quaternion.Euler(pitch, yaw, 0);
            var target = transform.position + Vector3.up * camHeight;
            var pos = target - rot * Vector3.forward * camDistance;
            if (Physics.SphereCast(target, 0.25f, pos - target, out var hit, camDistance, ~0, QueryTriggerInteraction.Ignore) && !hit.collider.GetComponentInParent<PlayerController>()) pos = target + (pos - target).normalized * Mathf.Max(0.5f, hit.distance - 0.1f);
            cameraTransform.SetPositionAndRotation(pos, Quaternion.LookRotation(target - pos));
        }
    }

    void UpdateInteract()
    {
        Interactable best = null; float bestD = interactRange;
        foreach (var c in Physics.OverlapSphere(transform.position + Vector3.up, interactRange))
        { var it = c.GetComponentInParent<Interactable>(); if (!it || !it.CanUse) continue; float d = Vector3.Distance(transform.position, c.bounds.ClosestPoint(transform.position)); if (d < bestD) { bestD = d; best = it; } }
        if (best != current) { current = best; GameManager.Instance?.SetPrompt(current ? current.prompt : null); }
        if (InteractEdge() && current) { if (animator) animator.SetTrigger("Interact"); current.Use(); GameManager.Instance?.SetPrompt(current && current.CanUse ? current.prompt : null); }
    }
}
